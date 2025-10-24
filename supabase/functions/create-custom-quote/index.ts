import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const quoteSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  phone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian phone number format (+91XXXXXXXXXX)'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
  equipmentType: z.string().trim().min(2, 'Equipment type required').max(100, 'Equipment type too long'),
  projectDescription: z.string().trim().min(10, 'Please provide detailed project description').max(2000, 'Description too long'),
  location: z.string().trim().min(5, 'Please provide complete location').max(500, 'Location too long'),
  duration: z.string().trim().min(1, 'Duration required').max(100, 'Duration too long'),
  budgetRange: z.string().max(100, 'Budget range too long').optional()
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

    // Get user if authenticated (optional for custom quotes)
    let user = null
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data } = await supabase.auth.getUser(token)
      user = data.user
    }

    const rawData = await req.json()
    
    // Validate input
    const validationResult = quoteSchema.safeParse(rawData)
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
    
    const quoteData = validationResult.data
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
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})