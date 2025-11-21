-- Fix admin dashboard authorization bypass by adding proper RLS policies
-- This ensures admin access is verified server-side, not just client-side

-- Update bookings policy to allow admin access
DROP POLICY IF EXISTS "Users can view their bookings" ON public.bookings;

CREATE POLICY "Users can view their bookings or admins can view all"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (
    (client_id = get_user_profile_id(auth.uid())) 
    OR (operator_id = get_user_profile_id(auth.uid()))
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Update profiles policy to allow admin access
DROP POLICY IF EXISTS "Authenticated users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view profiles or admins can view all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    true OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Update payments policy to allow admin access
DROP POLICY IF EXISTS "Users can view payments for their bookings" ON public.payments;

CREATE POLICY "Users can view payments for their bookings or admins can view all"
  ON public.payments FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings
      WHERE (client_id = get_user_profile_id(auth.uid())) 
         OR (operator_id = get_user_profile_id(auth.uid()))
    )
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

-- Update equipment policy to allow admin access
DROP POLICY IF EXISTS "Anyone can view available equipment" ON public.equipment;

CREATE POLICY "Anyone can view equipment or admins can view all"
  ON public.equipment FOR SELECT
  TO authenticated
  USING (
    true OR public.has_role(auth.uid(), 'admin'::app_role)
  );