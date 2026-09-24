-- =========================================================
-- REWARE Academic Resource Sharing Platform
-- Supabase Schema Migration: Departments & Resources
-- =========================================================

-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.departments (
  id TEXT PRIMARY KEY, -- e.g. 'CSBS', 'CSE', 'AIDS', 'AIML', 'VLSI'
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_gradient TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'Notes', 'Assignments', 'Previous Year Paper', 'Important Questions', 'Coding Resources',
    'NOTES', 'PYQ', 'LAB_MANUAL', 'QUESTION_PAPER', 'Lab Manual'
  )),
  dept_id TEXT REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL,
  department_id TEXT REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL,
  semester TEXT NOT NULL, -- e.g. '1st Year', '2nd Year', '3rd Year', '4th Year'
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT DEFAULT 0,
  file_type TEXT,
  visibility TEXT DEFAULT 'Visible to all students',
  uploader_name TEXT NOT NULL DEFAULT 'Anonymous Student',
  uploader_email TEXT,
  uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved BOOLEAN DEFAULT TRUE,
  downloads_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backward compatibility columns and constraints
ALTER TABLE public.resources ALTER COLUMN uploaded_by DROP NOT NULL;
ALTER TABLE public.resources ALTER COLUMN file_url DROP NOT NULL;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS dept_id TEXT REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS department_id TEXT REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;
ALTER TABLE public.resources ALTER COLUMN department_id DROP NOT NULL;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS uploader_name TEXT DEFAULT 'Anonymous Student';
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS uploader_email TEXT;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.resources ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'Visible to all students';

-- Trigger function to keep dept_id and department_id synchronized
CREATE OR REPLACE FUNCTION sync_dept_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.dept_id IS NOT NULL AND NEW.department_id IS NULL THEN
    NEW.department_id := NEW.dept_id;
  ELSIF NEW.department_id IS NOT NULL AND NEW.dept_id IS NULL THEN
    NEW.dept_id := NEW.department_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_dept_id ON public.resources;
CREATE TRIGGER trg_sync_dept_id
BEFORE INSERT OR UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION sync_dept_id();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resources_dept_id ON public.resources(dept_id);
CREATE INDEX IF NOT EXISTS idx_resources_department_id ON public.resources(department_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_semester ON public.resources(semester);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON public.resources(subject);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);

-- 3. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES public.resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Read-only public policies (Public SELECT only)
DROP POLICY IF EXISTS "Anyone can view departments" ON public.departments;
DROP POLICY IF EXISTS "Allow public read on departments" ON public.departments;
CREATE POLICY "Allow public read on departments" ON public.departments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can select resources" ON public.resources;
DROP POLICY IF EXISTS "Allow public read on resources" ON public.resources;
CREATE POLICY "Allow public read on resources" ON public.resources
  FOR SELECT USING (true);

-- Contact messages insert policy
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow insert on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow insert on contact_messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Bookmarks user policy
DROP POLICY IF EXISTS "Users can manage their own bookmarks" ON public.bookmarks;
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks
  FOR ALL USING (auth.uid() = user_id);
