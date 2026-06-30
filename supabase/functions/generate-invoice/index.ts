// Generates a GST tax invoice (PDF) for a paid booking, uploads to storage, returns signed URL.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"
import { jsPDF } from "https://esm.sh/jspdf@2.5.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const Body = z.object({ booking_id: z.string().uuid() })
const GST_RATE = 0.18

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { booking_id } = parsed.data
    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('*, equipment(name, category), payments(id, amount, razorpay_payment_id, status)')
      .eq('id', booking_id).single()
    if (bErr || !booking) throw new Error('Booking not found')

    // existing invoice?
    const { data: existing } = await supabase.from('invoices').select('*').eq('booking_id', booking_id).maybeSingle()
    if (existing?.pdf_url) {
      const { data: signed } = await supabase.storage.from('documents').createSignedUrl(existing.pdf_url, 60 * 60 * 24 * 7)
      return new Response(JSON.stringify({ invoice: existing, url: signed?.signedUrl }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const subtotal = Number(booking.total_amount) - Number(booking.gst_amount ?? 0) + Number(booking.discount_amount ?? 0)
    const gstAmount = Number(booking.gst_amount ?? (subtotal * GST_RATE).toFixed(2))
    const discount = Number(booking.discount_amount ?? 0)
    const total = Number(booking.total_amount)

    const { data: seq } = await supabase.rpc('nextval' as any, {}) as any
    // fallback invoice number scheme
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

    // Build PDF
    const doc = new jsPDF()
    doc.setFontSize(18); doc.text('HeavyRent — Tax Invoice', 14, 20)
    doc.setFontSize(10)
    doc.text(`Invoice #: ${invoiceNumber}`, 14, 32)
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 38)
    doc.text(`Booking ID: ${booking.id}`, 14, 44)
    doc.text(`Customer: ${booking.client_name}`, 14, 54)
    doc.text(`Phone: ${booking.client_phone}`, 14, 60)
    if (booking.client_email) doc.text(`Email: ${booking.client_email}`, 14, 66)
    doc.text(`Pickup: ${booking.pickup_address}`, 14, 72)
    doc.text(`Delivery: ${booking.delivery_address}`, 14, 78)

    doc.setFontSize(12); doc.text('Service Details', 14, 92)
    doc.setFontSize(10)
    // @ts-ignore
    doc.text(`Equipment: ${booking.equipment?.name ?? '-'} (${booking.equipment?.category ?? ''})`, 14, 100)
    doc.text(`Duration: ${booking.duration_hours} hours`, 14, 106)
    doc.text(`Rate: ₹${booking.base_rate}/hr`, 14, 112)

    let y = 128
    const row = (label: string, val: string) => { doc.text(label, 14, y); doc.text(val, 180, y, { align: 'right' }); y += 7 }
    row('Subtotal', `₹${subtotal.toFixed(2)}`)
    if (Number(booking.transport_fee ?? 0) > 0) row('Transport', `₹${Number(booking.transport_fee).toFixed(2)}`)
    if (Number(booking.operator_fee ?? 0) > 0) row('Operator Fee', `₹${Number(booking.operator_fee).toFixed(2)}`)
    if (discount > 0) row('Discount', `-₹${discount.toFixed(2)}`)
    row('GST (18%)', `₹${gstAmount.toFixed(2)}`)
    doc.setFont(undefined, 'bold'); row('Total', `₹${total.toFixed(2)}`); doc.setFont(undefined, 'normal')

    doc.setFontSize(8)
    doc.text('This is a computer-generated invoice. HeavyRent Pvt Ltd.', 14, 270)

    const pdfBytes = doc.output('arraybuffer')
    const filePath = `invoices/${booking.id}/${invoiceNumber}.pdf`
    const { error: upErr } = await supabase.storage.from('documents').upload(filePath, new Uint8Array(pdfBytes), {
      contentType: 'application/pdf', upsert: true,
    })
    if (upErr) throw upErr

    const paymentId = Array.isArray(booking.payments) ? booking.payments[0]?.id : null

    const { data: invoice, error: iErr } = await supabase.from('invoices').insert({
      invoice_number: invoiceNumber,
      booking_id: booking.id,
      payment_id: paymentId,
      subtotal,
      gst_amount: gstAmount,
      discount_amount: discount,
      total,
      pdf_url: filePath,
    }).select().single()
    if (iErr) throw iErr

    const { data: signed } = await supabase.storage.from('documents').createSignedUrl(filePath, 60 * 60 * 24 * 7)

    return new Response(JSON.stringify({ invoice, url: signed?.signedUrl }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'error' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
