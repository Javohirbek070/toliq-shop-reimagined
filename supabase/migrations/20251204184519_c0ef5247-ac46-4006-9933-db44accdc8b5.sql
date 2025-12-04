-- Create function to check if user is owner
CREATE OR REPLACE FUNCTION public.is_owner(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'owner'
  )
$$;

-- Update RLS policy for user_roles to allow owner to manage all roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Owners can manage all roles"
ON public.user_roles
FOR ALL
USING (is_owner(auth.uid()));

CREATE POLICY "Admins and owners can view roles"
ON public.user_roles
FOR SELECT
USING (has_role(auth.uid(), 'admin') OR is_owner(auth.uid()));