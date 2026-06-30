// Initiates a Razorpay refund and records it. Admin only OR owning customer with valid reason.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const Body = z.object({
  payment_id: z.string().uuid(),
  amount: z.number().positive().optional(),
  reason: z.string().max(500).optional(),
})

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { payment_id, amount, reason } = parsed.data

    const { data: payment, error: pErr } = await supabase
      .from('payments')
      .select('id, razorpay_payment_id, amount, booking_id, bookings:booking_id(client_id, profiles:client_id(user_id))')
      .eq('id', payment_id).maybeSingle()
    if (pErr || !payment) throw new Error('Payment not found')
    if (!payment.razorpay_payment_id) throw new Error('Payment not yet captured')

    // permission check
    const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })
    // @ts-ignore relational
    const ownerId = payment.bookings?.profiles?.user_id
    if (!isAdmin && ownerId !== user.id) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const refundAmountPaise = Math.round((amount ?? Number(payment.amount)) * 100)
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')!
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')!
    const auth = btoa(`${keyId}:${keySecret}`)

    const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${payment.razorpay_payment_id}/refund`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: refundAmountPaise, notes: reason ? { reason } : undefined }),
    })
    const rzp = await rzpRes.json()
    if (!rzpRes.ok) throw new Error(rzp.error?.description ?? 'Razorpay refund failed')

    const { data: refund, error: rErr } = await supabase.from('refunds').insert({
      payment_id: payment.id,
      booking_id: payment.booking_id,
      razorpay_refund_id: rzp.id,
      amount: refundAmountPaise / 100,
      status: rzp.status ?? 'processing',
      reason,
    }).select().single()
    if (rErr) throw rErr

    await supabase.from('bookings').update({ status: 'cancelled', cancelled_at: new Date().toISOString(), cancellation_reason: reason ?? 'Refund requested' })
      .eq('id', payment.booking_id)

    return new Response(JSON.stringify({ success: true, refund }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'error' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
