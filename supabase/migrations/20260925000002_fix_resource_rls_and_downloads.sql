-- =========================================================
-- REWARE / ritresources Academic Resource Sharing Platform
-- Migration: Fix RLS Policies for Resources & Downloads Counter
-- =========================================================

-- 1. Remove restrictive insert and update policies
DROP POLICY IF EXISTS "Admin can insert resources into any department" ON public.resources;
DROP POLICY IF EXISTS "Faculty can insert resources into own department" ON public.resources;
DROP POLICY IF EXISTS "Allow insert on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated insert on resources" ON public.resources;

-- 2. Allow any student, faculty, or authenticated user to share resources
CREATE POLICY "Allow insert on resources" ON public.resources
  FOR INSERT WITH CHECK (true);

-- 3. Allow public updates on resources (e.g. downloads count)
DROP POLICY IF EXISTS "Allow update on resources" ON public.resources;
DROP POLICY IF EXISTS "Uploader or Admin can update resources" ON public.resources;
CREATE POLICY "Allow update on resources" ON public.resources
  FOR UPDATE USING (true);

-- 4. Allow resource owners or admin to delete
DROP POLICY IF EXISTS "Uploader or Admin can delete resources" ON public.resources;
CREATE POLICY "Uploader or Admin can delete resources" ON public.resources
  FOR DELETE USING (
    (uploaded_by = auth.uid()) OR 
    (uploader_id = auth.uid()) OR 
    (get_my_role() = 'ADMIN'::text)
  );

-- 5. Safe atomic RPC function for incrementing resource downloads
CREATE OR REPLACE FUNCTION public.increment_resource_downloads(resource_id UUID)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE public.resources
  SET downloads_count = COALESCE(downloads_count, 0) + 1
  WHERE id = resource_id
  RETURNING downloads_count INTO new_count;
  RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_resource_downloads(UUID) TO anon, authenticated, service_role;
