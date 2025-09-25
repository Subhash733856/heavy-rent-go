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

    const url = new URL(req.url)
    const searchParams = url.searchParams

    // Extract query parameters
    const category = searchParams.get('category')
    const city = searchParams.get('city')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius') || '50' // Default 50km radius
    const available = searchParams.get('available')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('equipment')
      .select(`
        *,
        profiles!owner_id (
          id,
          name,
          rating,
          total_reviews,
          is_verified
        )
      `)
      .eq('is_active', true)

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (city) {
      query = query.ilike('city', `%${city}%`)
    }

    if (minPrice) {
      query = query.gte('price_per_hour', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.lte('price_per_hour', parseFloat(maxPrice))
    }

    if (available === 'true') {
      query = query.eq('is_available', true)
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data: equipment, error, count } = await query

    if (error) {
      throw new Error(`Failed to fetch equipment: ${error.message}`)
    }

    // If location-based search is requested
    let filteredEquipment = equipment
    if (lat && lng && equipment) {
      const userLat = parseFloat(lat)
      const userLng = parseFloat(lng)
      const maxRadius = parseFloat(radius)

      filteredEquipment = equipment.filter(item => {
        if (!item.location_lat || !item.location_lng) return true
        
        const distance = calculateDistance(
          userLat, userLng,
          parseFloat(item.location_lat), parseFloat(item.location_lng)
        )
        
        return distance <= maxRadius
      })

      // Sort by distance
      filteredEquipment.sort((a, b) => {
        const distanceA = calculateDistance(
          userLat, userLng,
          parseFloat(a.location_lat), parseFloat(a.location_lng)
        )
        const distanceB = calculateDistance(
          userLat, userLng,
          parseFloat(b.location_lat), parseFloat(b.location_lng)
        )
        return distanceA - distanceB
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: filteredEquipment,
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
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}