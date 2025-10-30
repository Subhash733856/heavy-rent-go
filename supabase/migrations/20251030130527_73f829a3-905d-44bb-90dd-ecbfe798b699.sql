-- Drop policies that depend on profiles.role
DROP POLICY IF EXISTS "Clients can view operator profiles" ON public.profiles;
DROP POLICY IF EXISTS "Operators can view clients for their bookings" ON public.profiles;

-- Drop the role column from profiles
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;

-- Create a general policy for profiles
CREATE POLICY "Authenticated users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Drop the permissive notifications insert policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Create a restricted policy for notifications insert (only from service role)
CREATE POLICY "Service role can insert notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);

-- Ensure payments table has immutability policies
DROP POLICY IF EXISTS "Payment records are immutable" ON public.payments;
DROP POLICY IF EXISTS "Payment records cannot be deleted" ON public.payments;

CREATE POLICY "Payments cannot be updated"
ON public.payments
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Payments cannot be deleted"
ON public.payments
FOR DELETE
TO authenticated
USING (false);