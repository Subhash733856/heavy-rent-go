import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts"

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      booking_id 
    } = await req.json()

    // Verify payment signature
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!razorpayKeySecret) {
      throw new Error('Razorpay configuration missing')
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      throw new Error('Payment verification failed')
    }

    // Update payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .update({
        razorpay_payment_id: razorpay_payment_id,
        status: 'paid',
        payment_date: new Date().toISOString()
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single()

    if (paymentError) {
      throw new Error(`Failed to update payment: ${paymentError.message}`)
    }

    // Update booking status
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', booking_id)
      .select('*, equipment(name, owner_id)')
      .single()

    if (bookingError) {
      throw new Error(`Failed to update booking: ${bookingError.message}`)
    }

    // Create notifications
    await Promise.all([
      // Notify client
      supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: 'Payment Successful',
          message: `Payment confirmed for ${booking.equipment.name}. Your booking is now confirmed.`,
          type: 'payment_success',
          data: { booking_id: booking.id, payment_id: payment.id }
        }),
      
      // Notify operator
      supabase
        .from('notifications')
        .insert({
          user_id: booking.equipment.owner_id,
          title: 'Booking Confirmed',
          message: `Payment received for ${booking.equipment.name}. Booking is now confirmed.`,
          type: 'booking_confirmed',
          data: { booking_id: booking.id, payment_id: payment.id }
        })
    ])

    return new Response(
      JSON.stringify({
        success: true,
        payment,
        booking,
        message: 'Payment verified successfully'
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