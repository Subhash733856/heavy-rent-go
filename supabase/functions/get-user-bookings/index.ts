import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const role = url.searchParams.get('role') || 'client' // 'client' or 'operator'
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    let query = supabase
      .from('bookings')
      .select(`
        *,
        equipment (
          id,
          name,
          type,
          category,
          images,
          price_per_hour
        ),
        payments (
          id,
          status,
          amount,
          payment_date,
          razorpay_payment_id
        ),
        profiles!client_id (
          id,
          name,
          phone
        )
      `)

    // Filter by user role
    if (role === 'client') {
      query = query.eq('client_id', user.id)
    } else {
      query = query.eq('operator_id', user.id)
    }

    // Filter by status if provided
    if (status) {
      query = query.eq('status', status)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to).order('created_at', { ascending: false })

    const { data: bookings, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: bookings,
        pagination: {
          page,
          limit,
          total: count || 0,
          hasMore: (count || 0) > page * limit
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})