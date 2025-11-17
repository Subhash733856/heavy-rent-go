-- Ensure admin role exists in app_role enum (if not already present)
-- Note: This will only work if 'admin' doesn't already exist

-- Check if we need to add admin users to user_roles
-- Add a sample admin role assignment function for manual use
CREATE OR REPLACE FUNCTION public.assign_admin_role(_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;

COMMENT ON FUNCTION public.assign_admin_role IS 'Manually assign admin role to a user. Usage: SELECT assign_admin_role(''user-uuid-here'');';