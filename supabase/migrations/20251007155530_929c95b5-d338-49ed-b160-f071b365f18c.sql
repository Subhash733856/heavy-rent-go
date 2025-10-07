-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL CHECK (role IN ('client', 'operator')),
  phone TEXT,
  location TEXT,
  bio TEXT,
  rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create equipment table
CREATE TABLE public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  specifications JSONB,
  hourly_rate NUMERIC(10,2) NOT NULL,
  daily_rate NUMERIC(10,2),
  images TEXT[],
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  operator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'ongoing', 'completed', 'cancelled')),
  location TEXT NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  gst_amount NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  advance_paid NUMERIC(10,2) DEFAULT 0,
  balance_due NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create custom_quotes table
CREATE TABLE public.custom_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  project_description TEXT,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'converted')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_quotes ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Equipment RLS policies
CREATE POLICY "Anyone can view available equipment"
  ON public.equipment FOR SELECT
  USING (available = true);

CREATE POLICY "Operators can view their own equipment"
  ON public.equipment FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = owner_id));

CREATE POLICY "Operators can insert their own equipment"
  ON public.equipment FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = owner_id AND role = 'operator'));

CREATE POLICY "Operators can update their own equipment"
  ON public.equipment FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = owner_id));

CREATE POLICY "Operators can delete their own equipment"
  ON public.equipment FOR DELETE
  USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = owner_id));

-- Bookings RLS policies
CREATE POLICY "Users can view their own bookings as client"
  ON public.bookings FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = client_id));

CREATE POLICY "Operators can view bookings for their equipment"
  ON public.bookings FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = operator_id));

CREATE POLICY "Clients can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = client_id AND role = 'client'));

CREATE POLICY "Operators can update bookings for their equipment"
  ON public.bookings FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = operator_id));

-- Payments RLS policies
CREATE POLICY "Users can view payments for their bookings"
  ON public.payments FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      OR operator_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create payments for their bookings"
  ON public.payments FOR INSERT
  WITH CHECK (
    booking_id IN (
      SELECT id FROM public.bookings 
      WHERE client_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- Custom quotes RLS policies
CREATE POLICY "Anyone can submit custom quotes"
  ON public.custom_quotes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Operators can view all custom quotes"
  ON public.custom_quotes FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE role = 'operator'));

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_equipment_owner_id ON public.equipment(owner_id);
CREATE INDEX idx_equipment_category ON public.equipment(category);
CREATE INDEX idx_equipment_city ON public.equipment(city);
CREATE INDEX idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX idx_bookings_operator_id ON public.bookings(operator_id);
CREATE INDEX idx_bookings_equipment_id ON public.bookings(equipment_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);

-- Function to check booking overlap
CREATE OR REPLACE FUNCTION public.check_booking_overlap(
  p_equipment_id UUID,
  p_start_time TIMESTAMPTZ,
  p_end_time TIMESTAMPTZ,
  p_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.bookings
    WHERE equipment_id = p_equipment_id
    AND status NOT IN ('cancelled', 'completed')
    AND (p_booking_id IS NULL OR id != p_booking_id)
    AND (
      (start_time <= p_start_time AND end_time > p_start_time)
      OR (start_time < p_end_time AND end_time >= p_end_time)
      OR (start_time >= p_start_time AND end_time <= p_end_time)
    )
  );
END;
$$;

-- Insert sample equipment data
INSERT INTO public.equipment (owner_id, name, type, category, description, hourly_rate, daily_rate, location, city, images) 
SELECT 
  p.id,
  'Excavator CAT 320',
  'Excavator',
  'Earth Moving',
  'Heavy-duty excavator for construction and mining',
  1500,
  10000,
  'Mumbai, Maharashtra',
  'Mumbai',
  ARRAY['https://images.unsplash.com/photo-1581094794329-c8112a89af12']
FROM public.profiles p
WHERE p.role = 'operator'
LIMIT 1
ON CONFLICT DO NOTHING;