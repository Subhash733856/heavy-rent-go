// Cancels a booking and (optionally) triggers a refund via refund-payment.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const Body = z.object({ booking_id: z.string().uuid(), reason: z.string().max(500).optional() })

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { booking_id, reason } = parsed.data

    const { data: booking, error: bErr } = await supabase
      .from('bookings')
      .select('id, status, start_time, total_amount, client_id, profiles:client_id(user_id), payments(id, status)')
      .eq('id', booking_id).single()
    if (bErr || !booking) throw new Error('Booking not found')

    // @ts-ignore
    const ownerUserId = booking.profiles?.user_id
    if (ownerUserId !== user.id) {
      const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })
      if (!isAdmin) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (['cancelled', 'completed'].includes(booking.status)) {
      return new Response(JSON.stringify({ error: 'Cannot cancel this booking' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    await supabase.from('bookings').update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason ?? null,
    }).eq('id', booking_id)

    // Refund if paid
    const paid = (booking.payments as any[])?.find(p => p.status === 'paid')
    let refundResult: unknown = null
    if (paid) {
      const r = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/refund-payment`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paid.id, reason: reason ?? 'Booking cancelled' }),
      })
      refundResult = await r.json()
    }

    return new Response(JSON.stringify({ success: true, refund: refundResult }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'error' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
