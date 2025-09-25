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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const bookingData = await req.json()
    const {
      equipmentId,
      startTime,
      endTime,
      durationHours,
      clientName,
      clientPhone,
      pickupAddress,
      deliveryAddress,
      specialRequirements
    } = bookingData

    // Get equipment details
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .select('*, owner_id, price_per_hour')
      .eq('id', equipmentId)
      .single()

    if (equipmentError || !equipment) {
      throw new Error('Equipment not found')
    }

    // Check for booking overlaps
    const { data: overlapCheck } = await supabase
      .rpc('check_booking_overlap', {
        eq_id: equipmentId,
        start_t: startTime,
        end_t: endTime
      })

    if (overlapCheck) {
      throw new Error('Equipment is already booked for the selected time period')
    }

    // Calculate pricing
    const basePrice = equipment.price_per_hour * durationHours
    const gstAmount = basePrice * 0.18 // 18% GST
    const totalPrice = basePrice + gstAmount
    const advanceAmount = totalPrice * 0.30 // 30% advance

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        equipment_id: equipmentId,
        client_id: user.id,
        operator_id: equipment.owner_id,
        start_time: startTime,
        end_time: endTime,
        duration_hours: durationHours,
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        base_price: basePrice,
        gst_amount: gstAmount,
        total_price: totalPrice,
        advance_amount: advanceAmount,
        client_name: clientName,
        client_phone: clientPhone,
        special_requirements: specialRequirements,
        status: 'pending'
      })
      .select()
      .single()

    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`)
    }

    // Create notification for operator
    await supabase
      .from('notifications')
      .insert({
        user_id: equipment.owner_id,
        title: 'New Booking Request',
        message: `New booking request for ${equipment.name} from ${clientName}`,
        type: 'booking_request',
        data: { booking_id: booking.id }
      })

    return new Response(
      JSON.stringify({ 
        success: true, 
        booking,
        message: 'Booking created successfully' 
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