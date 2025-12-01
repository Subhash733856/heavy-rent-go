import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const paymentOrderSchema = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  amount: z.number().positive('Amount must be positive').max(10000000, 'Amount too large'),
  currency: z.string().regex(/^[A-Z]{3}$/, 'Invalid currency code').default('INR')
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const rawData = await req.json()
    
    // Validate input
    const validationResult = paymentOrderSchema.safeParse(rawData)
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Validation failed', 
          details: validationResult.error.issues 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }
    
    const { bookingId, amount, currency } = validationResult.data

    // Get booking details
    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('User profile not found')
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, equipment(name), profiles!client_id(name, phone)')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      throw new Error('Booking not found')
    }

    if (booking.client_id !== profile.id) {
      throw new Error('Unauthorized to pay for this booking')
    }

    // Create Razorpay order
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Missing Razorpay credentials:', { 
        hasKeyId: !!razorpayKeyId, 
        hasKeySecret: !!razorpayKeySecret 
      })
      throw new Error('Razorpay credentials not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Cloud secrets.')
    }

    const orderPayload = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: currency,
      receipt: bookingId, // Razorpay requires max 40 chars
      notes: {
        booking_id: bookingId,
        equipment_name: booking.equipment.name,
        client_name: booking.client_name
      }
    }

    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
    
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderPayload)
    })

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text()
      throw new Error(`Razorpay order creation failed: ${errorData}`)
    }

    const razorpayOrder = await razorpayResponse.json()

    // Store payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        razorpay_order_id: razorpayOrder.id,
        amount: amount,
        currency: currency,
        status: 'pending'
      })
      .select()
      .single()

    if (paymentError) {
      throw new Error(`Failed to create payment record: ${paymentError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: razorpayOrder,
        payment: payment,
        key: razorpayKeyId
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
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})