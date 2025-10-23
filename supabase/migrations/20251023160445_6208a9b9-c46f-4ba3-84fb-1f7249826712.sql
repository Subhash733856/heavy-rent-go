-- ============================================
-- HEAVYRENT COMPLETE SECURE DATABASE SCHEMA
-- ============================================

-- 1. CREATE ENUM TYPES
-- ============================================

CREATE TYPE public.app_role AS ENUM ('admin', 'client', 'operator');
CREATE TYPE public.equipment_status AS ENUM ('available', 'rented', 'maintenance', 'unavailable');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE public.quote_status AS ENUM ('new', 'assigned', 'contacted', 'converted', 'closed');

-- 2. CREATE PROFILES TABLE
-- ============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'operator', 'admin')),
  rating DECIMAL(3,2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  bio TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. CREATE USER_ROLES TABLE (SECURE ROLE MANAGEMENT)
-- ============================================

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. CREATE EQUIPMENT TABLE
-- ============================================

CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  specifications JSONB,
  daily_rate DECIMAL(10,2) NOT NULL,
  weekly_rate DECIMAL(10,2),
  monthly_rate DECIMAL(10,2),
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  status equipment_status DEFAULT 'available',
  images TEXT[],
  available_from TIMESTAMPTZ,
  available_until TIMESTAMPTZ,
  min_rental_period INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- 5. CREATE BOOKINGS TABLE
-- ============================================

CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.profiles(id) NOT NULL,
  operator_id UUID REFERENCES public.profiles(id) NOT NULL,
  status booking_status DEFAULT 'pending' NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration_hours INTEGER NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  special_requirements TEXT,
  base_rate DECIMAL(10,2) NOT NULL,
  transport_fee DECIMAL(10,2) DEFAULT 0,
  operator_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CONSTRAINT check_valid_duration CHECK (end_time > start_time)
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- 6. CREATE PAYMENTS TABLE
-- ============================================

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR' NOT NULL,
  status payment_status DEFAULT 'pending' NOT NULL,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 7. CREATE CUSTOM_QUOTES TABLE
-- ============================================

CREATE TABLE public.custom_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  project_description TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  status quote_status DEFAULT 'new' NOT NULL,
  assigned_to UUID REFERENCES public.profiles(id),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.custom_quotes ENABLE ROW LEVEL SECURITY;

-- 8. CREATE SECURITY AUDIT LOG
-- ============================================

CREATE TABLE public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- 9. CREATE SECURITY DEFINER FUNCTIONS
-- ============================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Get user's profile ID
CREATE OR REPLACE FUNCTION public.get_user_profile_id(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = _user_id;
$$;

-- Check if user is operator
CREATE OR REPLACE FUNCTION public.is_operator(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'operator');
$$;

-- Check if user is client
CREATE OR REPLACE FUNCTION public.is_client(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'client');
$$;

-- Update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Check for booking overlaps
CREATE OR REPLACE FUNCTION public.check_booking_overlap(
  p_equipment_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings
    WHERE equipment_id = p_equipment_id
      AND status != 'cancelled'
      AND (p_exclude_booking_id IS NULL OR id != p_exclude_booking_id)
      AND (
        (start_time, end_time) OVERLAPS (p_start_time, p_end_time)
      )
  );
$$;

-- 10. CREATE TRIGGERS
-- ============================================

-- Update timestamps on profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update timestamps on equipment
CREATE TRIGGER update_equipment_updated_at
BEFORE UPDATE ON public.equipment
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update timestamps on bookings
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update timestamps on payments
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update timestamps on custom_quotes
CREATE TRIGGER update_custom_quotes_updated_at
BEFORE UPDATE ON public.custom_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 11. CREATE PROFILE AND ROLE ON USER SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  
  -- Insert role into user_roles table
  IF NEW.raw_user_meta_data->>'role' = 'operator' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'operator');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'client');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile and role on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 12. RLS POLICIES - USER_ROLES TABLE
-- ============================================

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Prevent direct role modifications (only through functions/admin)
CREATE POLICY "Prevent direct role modifications"
  ON public.user_roles FOR ALL
  USING (false);

-- 13. RLS POLICIES - PROFILES TABLE
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Clients can view operator profiles (for booking context)
CREATE POLICY "Clients can view operator profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    role = 'operator' 
    AND public.is_client(auth.uid())
  );

-- Operators can view client profiles only for their bookings
CREATE POLICY "Operators can view clients for their bookings"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    role = 'client'
    AND public.is_operator(auth.uid())
    AND id IN (
      SELECT client_id FROM public.bookings
      WHERE operator_id = public.get_user_profile_id(auth.uid())
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can insert their own profile (handled by trigger)
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 14. RLS POLICIES - EQUIPMENT TABLE
-- ============================================

-- Everyone can view available equipment
CREATE POLICY "Anyone can view available equipment"
  ON public.equipment FOR SELECT
  USING (true);

-- Operators can insert equipment
CREATE POLICY "Operators can insert equipment"
  ON public.equipment FOR INSERT
  TO authenticated
  WITH CHECK (
    owner_id = public.get_user_profile_id(auth.uid())
    AND public.is_operator(auth.uid())
  );

-- Operators can update their equipment
CREATE POLICY "Operators can update their equipment"
  ON public.equipment FOR UPDATE
  TO authenticated
  USING (owner_id = public.get_user_profile_id(auth.uid()))
  WITH CHECK (owner_id = public.get_user_profile_id(auth.uid()));

-- Operators can delete their equipment
CREATE POLICY "Operators can delete their equipment"
  ON public.equipment FOR DELETE
  TO authenticated
  USING (owner_id = public.get_user_profile_id(auth.uid()));

-- 15. RLS POLICIES - BOOKINGS TABLE
-- ============================================

-- Users can view their bookings
CREATE POLICY "Users can view their bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    client_id = public.get_user_profile_id(auth.uid())
    OR operator_id = public.get_user_profile_id(auth.uid())
  );

-- Clients can create bookings
CREATE POLICY "Clients can create bookings"
  ON public.bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    client_id = public.get_user_profile_id(auth.uid())
    AND public.is_client(auth.uid())
  );

-- Operators can update bookings for their equipment
CREATE POLICY "Operators can update their bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (operator_id = public.get_user_profile_id(auth.uid()))
  WITH CHECK (operator_id = public.get_user_profile_id(auth.uid()));

-- 16. RLS POLICIES - PAYMENTS TABLE
-- ============================================

-- Users can view payments for their bookings
CREATE POLICY "Users can view payments for their bookings"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE client_id = public.get_user_profile_id(auth.uid())
        OR operator_id = public.get_user_profile_id(auth.uid())
    )
  );

-- Users can insert payments for their bookings
CREATE POLICY "Users can insert payments"
  ON public.payments FOR INSERT
  TO authenticated
  WITH CHECK (
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE client_id = public.get_user_profile_id(auth.uid())
    )
  );

-- Payment records are immutable (cannot be updated)
CREATE POLICY "Payment records are immutable"
  ON public.payments FOR UPDATE
  USING (false);

-- Payment records cannot be deleted
CREATE POLICY "Payment records cannot be deleted"
  ON public.payments FOR DELETE
  USING (false);

-- 17. RLS POLICIES - CUSTOM_QUOTES TABLE
-- ============================================

-- Anyone can insert quote requests (unauthenticated access)
CREATE POLICY "Anyone can submit quote requests"
  ON public.custom_quotes FOR INSERT
  WITH CHECK (true);

-- Assigned operators can view their quotes
CREATE POLICY "Operators view assigned quotes"
  ON public.custom_quotes FOR SELECT
  TO authenticated
  USING (
    assigned_to = public.get_user_profile_id(auth.uid())
  );

-- Admins can view all quotes
CREATE POLICY "Admins view all quotes"
  ON public.custom_quotes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update quotes (for assignment)
CREATE POLICY "Admins can update quotes"
  ON public.custom_quotes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 18. RLS POLICIES - SECURITY_AUDIT_LOG TABLE
-- ============================================

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.security_audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));