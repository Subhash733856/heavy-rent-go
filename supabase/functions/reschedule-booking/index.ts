// Reschedules a booking. Creates a new booking row referencing the original via rescheduled_from.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const Body = z.object({
  booking_id: z.string().uuid(),
  new_start: z.string().datetime(),
  new_end: z.string().datetime(),
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

    const { booking_id, new_start, new_end } = parsed.data
    const start = new Date(new_start); const end = new Date(new_end)
    if (end <= start) return new Response(JSON.stringify({ error: 'Invalid time range' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { data: b, error: bErr } = await supabase.from('bookings').select('*, profiles:client_id(user_id)').eq('id', booking_id).single()
    if (bErr || !b) throw new Error('Booking not found')
    // @ts-ignore
    if (b.profiles?.user_id !== user.id) {
      const { data: isAdmin } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' })
      if (!isAdmin) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (b.status === 'cancelled' || b.status === 'completed') {
      return new Response(JSON.stringify({ error: 'Cannot reschedule this booking' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: overlap } = await supabase.rpc('check_booking_overlap', {
      p_equipment_id: b.equipment_id, p_start_time: new_start, p_end_time: new_end, p_exclude_booking_id: booking_id,
    })
    if (overlap) return new Response(JSON.stringify({ error: 'Time slot unavailable' }), { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const duration_hours = Math.ceil((end.getTime() - start.getTime()) / 3_600_000)

    await supabase.from('bookings').update({
      start_time: new_start, end_time: new_end, duration_hours, rescheduled_from: booking_id,
    }).eq('id', booking_id)

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'error' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
