// Razorpay webhook receiver: verifies HMAC SHA256 signature, then updates payment & booking.
// Configure webhook URL in Razorpay dashboard and set RAZORPAY_WEBHOOK_SECRET.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const raw = await req.text()
    const sig = req.headers.get('x-razorpay-signature') ?? ''
    const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')
    if (!secret) throw new Error('Webhook secret not configured')
    const expected = await hmacHex(secret, raw)
    if (expected !== sig) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid signature' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    const evt = JSON.parse(raw)
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

    const type = evt.event as string
    const pay = evt.payload?.payment?.entity
    const refund = evt.payload?.refund?.entity

    if (type === 'payment.captured' && pay) {
      await supabase.from('payments').update({
        status: 'paid',
        razorpay_payment_id: pay.id,
        payment_date: new Date().toISOString(),
      }).eq('razorpay_order_id', pay.order_id)
      const { data: p } = await supabase.from('payments').select('booking_id').eq('razorpay_order_id', pay.order_id).maybeSingle()
      if (p?.booking_id) await supabase.from('bookings').update({ status: 'confirmed' }).eq('id', p.booking_id)
    } else if (type === 'payment.failed' && pay) {
      await supabase.from('payments').update({ status: 'failed' }).eq('razorpay_order_id', pay.order_id)
    } else if ((type === 'refund.processed' || type === 'refund.created') && refund) {
      await supabase.from('refunds').update({
        status: refund.status ?? 'processed',
        razorpay_refund_id: refund.id,
      }).eq('razorpay_refund_id', refund.id)
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e instanceof Error ? e.message : 'error' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
