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

    const { bookingId, status, notes } = await req.json()

    // Valid status transitions
    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid booking status')
    }

    // Get current booking
    const { data: currentBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, equipment(name, owner_id)')
      .eq('id', bookingId)
      .single()

    if (fetchError || !currentBooking) {
      throw new Error('Booking not found')
    }

    // Check authorization
    const isOperator = currentBooking.operator_id === user.id
    const isClient = currentBooking.client_id === user.id

    if (!isOperator && !isClient) {
      throw new Error('Unauthorized to update this booking')
    }

    // Operators can change status, clients can only cancel
    if (!isOperator && status !== 'cancelled') {
      throw new Error('Clients can only cancel bookings')
    }

    // Update booking
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    }

    if (notes) {
      updateData.notes = notes
    }

    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select('*, equipment(name)')
      .single()

    if (updateError) {
      throw new Error(`Failed to update booking: ${updateError.message}`)
    }

    // Create notifications based on status change
    const notifications = []
    
    if (status === 'confirmed' && isOperator) {
      notifications.push({
        user_id: currentBooking.client_id,
        title: 'Booking Confirmed',
        message: `Your booking for ${currentBooking.equipment.name} has been confirmed by the operator.`,
        type: 'booking_confirmed',
        data: { booking_id: bookingId }
      })
    } else if (status === 'active' && isOperator) {
      notifications.push({
        user_id: currentBooking.client_id,
        title: 'Equipment Active',
        message: `Your booking for ${currentBooking.equipment.name} is now active.`,
        type: 'booking_active',
        data: { booking_id: bookingId }
      })
    } else if (status === 'completed' && isOperator) {
      notifications.push({
        user_id: currentBooking.client_id,
        title: 'Booking Completed',
        message: `Your booking for ${currentBooking.equipment.name} has been completed. Please rate your experience.`,
        type: 'booking_completed',
        data: { booking_id: bookingId }
      })
    } else if (status === 'cancelled') {
      const notifyUser = isClient ? currentBooking.operator_id : currentBooking.client_id
      const message = isClient ? 
        `Booking for ${currentBooking.equipment.name} has been cancelled by the client.` :
        `Your booking for ${currentBooking.equipment.name} has been cancelled by the operator.`
      
      notifications.push({
        user_id: notifyUser,
        title: 'Booking Cancelled',
        message,
        type: 'booking_cancelled',
        data: { booking_id: bookingId }
      })
    }

    // Insert notifications
    if (notifications.length > 0) {
      await supabase
        .from('notifications')
        .insert(notifications)
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking: updatedBooking,
        message: `Booking status updated to ${status}`
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