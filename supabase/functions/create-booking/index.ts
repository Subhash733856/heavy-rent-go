import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const bookingSchema = z.object({
  equipmentId: z.string().uuid('Invalid equipment ID'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
  durationHours: z.number().int().min(1, 'Minimum 1 hour').max(720, 'Maximum 30 days'),
  clientName: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  clientPhone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian phone number format (+91XXXXXXXXXX)'),
  pickupAddress: z.string().trim().min(10, 'Please provide complete pickup address').max(500, 'Address too long'),
  deliveryAddress: z.string().trim().min(10, 'Please provide complete delivery address').max(500, 'Address too long'),
  specialRequirements: z.string().max(2000, 'Requirements must be less than 2000 characters').optional()
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
  message: 'End time must be after start time'
}).refine(data => new Date(data.startTime) > new Date(), {
  message: 'Start time must be in the future'
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

    // Get the user's profile ID (not auth.users.id)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('User profile not found')
    }

    const rawData = await req.json()
    
    // Validate input
    const validationResult = bookingSchema.safeParse(rawData)
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
    
    const bookingData = validationResult.data
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
      .select('*, owner_id, daily_rate')
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

    // Calculate pricing (using daily rate)
    const basePrice = equipment.daily_rate * Math.ceil(durationHours / 24)
    const gstAmount = basePrice * 0.18 // 18% GST
    const totalPrice = basePrice + gstAmount
    const advanceAmount = totalPrice * 0.30 // 30% advance

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        equipment_id: equipmentId,
        client_id: profile.id,
        operator_id: equipment.owner_id,
        start_time: startTime,
        end_time: endTime,
        duration_hours: durationHours,
        pickup_address: pickupAddress,
        delivery_address: deliveryAddress,
        base_rate: basePrice,
        transport_fee: 0,
        operator_fee: 0,
        total_amount: totalPrice,
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
        booking: {
          ...booking,
          advance_amount: advanceAmount
        },
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