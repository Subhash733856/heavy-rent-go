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

    // Get user if authenticated (optional for custom quotes)
    let user = null
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data } = await supabase.auth.getUser(token)
      user = data.user
    }

    const quoteData = await req.json()
    const {
      name,
      phone,
      email,
      equipmentType,
      projectDescription,
      location,
      duration,
      budgetRange
    } = quoteData

    // Validate required fields
    if (!name || !phone || !equipmentType || !projectDescription || !location || !duration) {
      throw new Error('Missing required fields')
    }

    // Create custom quote
    const { data: quote, error: quoteError } = await supabase
      .from('custom_quotes')
      .insert({
        client_id: user?.id || null,
        name,
        phone,
        email,
        equipment_type: equipmentType,
        project_description: projectDescription,
        location,
        duration,
        budget_range: budgetRange,
        status: 'pending'
      })
      .select()
      .single()

    if (quoteError) {
      throw new Error(`Failed to create quote: ${quoteError.message}`)
    }

    // Send notification to admin (you can customize this)
    // For now, we'll just log it - in production you might want to send an email
    console.log('New custom quote request:', quote)

    return new Response(
      JSON.stringify({
        success: true,
        quote,
        message: 'Custom quote request submitted successfully. Our team will contact you within 24 hours.'
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