// Validates a coupon code and returns the discount amount for a given order total.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const Body = z.object({ code: z.string().min(1).max(64), order_amount: z.number().positive() })

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const token = (req.headers.get('Authorization') ?? '').replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const parsed = Body.safeParse(await req.json())
    if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.flatten() }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { code, order_amount } = parsed.data
    const { data: c } = await supabase.from('coupons').select('*').eq('code', code.toUpperCase()).maybeSingle()
    if (!c || !c.active) return new Response(JSON.stringify({ valid: false, error: 'Invalid coupon' }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const now = new Date()
    if (c.valid_until && new Date(c.valid_until) < now) return new Response(JSON.stringify({ valid: false, error: 'Coupon expired' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    if (c.valid_from && new Date(c.valid_from) > now) return new Response(JSON.stringify({ valid: false, error: 'Coupon not active yet' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    if (c.min_order_amount && order_amount < Number(c.min_order_amount)) return new Response(JSON.stringify({ valid: false, error: `Min order ₹${c.min_order_amount}` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    if (c.usage_limit && c.used_count >= c.usage_limit) return new Response(JSON.stringify({ valid: false, error: 'Coupon usage exceeded' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    let discount = (order_amount * Number(c.discount_percent)) / 100
    if (c.max_discount) discount = Math.min(discount, Number(c.max_discount))
    discount = Math.round(discount * 100) / 100

    return new Response(JSON.stringify({ valid: true, coupon_id: c.id, discount, code: c.code }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'error' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
