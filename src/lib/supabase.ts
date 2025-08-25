import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  role: 'client' | 'operator'
  name: string
  phone?: string
  location_lat?: number
  location_lng?: number
  city?: string
  state?: string
  rating: number
  total_reviews: number
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface Equipment {
  id: string
  owner_id: string
  name: string
  type: string
  category: string
  description?: string
  specifications?: any
  features?: string[]
  price_per_hour: number
  price_per_day: number
  location_lat: number
  location_lng: number
  city: string
  state: string
  address?: string
  images?: string[]
  is_available: boolean
  is_active: boolean
  rating: number
  total_reviews: number
  operator_name?: string
  operator_experience?: number
  fuel_included: boolean
  insurance_included: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface Booking {
  id: string
  equipment_id: string
  client_id: string
  operator_id: string
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  start_time: string
  end_time: string
  duration_hours: number
  location_lat?: number
  location_lng?: number
  pickup_address?: string
  delivery_address?: string
  base_price: number
  gst_amount: number
  total_price: number
  advance_amount: number
  client_name: string
  client_phone: string
  special_requirements?: string
  notes?: string
  created_at: string
  updated_at: string
  equipment?: Equipment
  payments?: Payment[]
}

export interface Payment {
  id: string
  booking_id: string
  razorpay_payment_id?: string
  razorpay_order_id?: string
  amount: number
  currency: string
  status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  payment_date?: string
  created_at: string
  updated_at: string
}

export interface CustomQuote {
  id: string
  client_id?: string
  name: string
  phone: string
  email?: string
  equipment_type: string
  project_description: string
  location: string
  duration: string
  budget_range?: string
  status: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

// API Functions
export const equipmentAPI = {
  // Get all equipment with filters
  async getEquipment(filters: {
    category?: string
    city?: string
    minPrice?: number
    maxPrice?: number
    lat?: number
    lng?: number
    radius?: number
    available?: boolean
    page?: number
    limit?: number
  } = {}) {
    const { data, error } = await supabase.functions.invoke('get-equipment', {
      body: filters
    })
    
    if (error) throw error
    return data
  },

  // Get single equipment by ID
  async getEquipmentById(id: string) {
    const { data, error } = await supabase
      .from('equipment')
      .select(`
        *,
        profiles!owner_id (
          id,
          name,
          rating,
          total_reviews,
          is_verified,
          phone
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

export const bookingAPI = {
  // Create new booking
  async createBooking(bookingData: {
    equipmentId: string
    startTime: string
    endTime: string
    durationHours: number
    clientName: string
    clientPhone: string
    pickupAddress?: string
    deliveryAddress?: string
    specialRequirements?: string
  }) {
    const { data, error } = await supabase.functions.invoke('create-booking', {
      body: bookingData
    })
    
    if (error) throw error
    return data
  },

  // Get user bookings
  async getUserBookings(filters: {
    status?: string
    role?: 'client' | 'operator'
    page?: number
    limit?: number
  } = {}) {
    const { data, error } = await supabase.functions.invoke('get-user-bookings', {
      body: filters
    })
    
    if (error) throw error
    return data
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string, notes?: string) {
    const { data, error } = await supabase.functions.invoke('update-booking-status', {
      body: { bookingId, status, notes }
    })
    
    if (error) throw error
    return data
  }
}

export const paymentAPI = {
  // Create Razorpay payment order
  async createPaymentOrder(bookingId: string, amount: number) {
    const { data, error } = await supabase.functions.invoke('create-razorpay-payment', {
      body: { bookingId, amount }
    })
    
    if (error) throw error
    return data
  },

  // Verify payment
  async verifyPayment(paymentData: {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
    booking_id: string
  }) {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: paymentData
    })
    
    if (error) throw error
    return data
  }
}

export const quoteAPI = {
  // Create custom quote
  async createCustomQuote(quoteData: {
    name: string
    phone: string
    email?: string
    equipmentType: string
    projectDescription: string
    location: string
    duration: string
    budgetRange?: string
  }) {
    const { data, error } = await supabase.functions.invoke('create-custom-quote', {
      body: quoteData
    })
    
    if (error) throw error
    return data
  }
}

export const authAPI = {
  // Sign up
  async signUp(email: string, password: string, name: string, role: 'client' | 'operator' = 'client') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role
        }
      }
    })
    
    if (error) throw error
    return data
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get user profile
  async getUserProfile(userId?: string) {
    const id = userId || (await this.getCurrentUser())?.id
    if (!id) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}