-- ==========================================
-- REWARE Academic Resource Sharing Platform
-- Supabase PostgreSQL Schema & Seed Data
-- ==========================================

-- Enable pgcrypto for UUIDs if not already enabled
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
  type TEXT NOT NULL CHECK (type IN ('Notes', 'Assignments', 'Previous Year Paper', 'Important Questions', 'Coding Resources')),
  dept_id TEXT REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL,
  semester TEXT NOT NULL, -- '1st Year', '2nd Year', '3rd Year', '4th Year'
  description TEXT,
  file_url TEXT,
  file_name TEXT,
  file_size BIGINT DEFAULT 0,
  file_type TEXT,
  visibility TEXT DEFAULT 'Visible to all students',
  uploader_name TEXT NOT NULL DEFAULT 'Anonymous',
  uploader_email TEXT,
  uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  downloads_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- INDEXES for fast search & filtering
CREATE INDEX IF NOT EXISTS idx_resources_dept_id ON public.resources(dept_id);
CREATE INDEX IF NOT EXISTS idx_resources_type ON public.resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_semester ON public.resources(semester);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON public.resources(subject);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON public.resources(created_at DESC);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Departments: readable by everyone
CREATE POLICY "Allow public read on departments" ON public.departments
  FOR SELECT USING (true);

-- Resources: readable by everyone
CREATE POLICY "Allow public read on resources" ON public.resources
  FOR SELECT USING (true);

-- Resources: insertable by anyone (or authenticated users)
CREATE POLICY "Allow insert on resources" ON public.resources
  FOR INSERT WITH CHECK (true);

-- Resources: update downloads count
CREATE POLICY "Allow update on resources" ON public.resources
  FOR UPDATE USING (true);

-- Contact messages: insertable by anyone
CREATE POLICY "Allow insert on contact_messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Bookmarks: user-specific
CREATE POLICY "Users can manage their own bookmarks" ON public.bookmarks
  FOR ALL USING (auth.uid() = user_id);

-- ==========================================
-- SEED DATA
-- ==========================================

-- Departments
INSERT INTO public.departments (id, name, full_name, description, icon_gradient, display_order)
VALUES
  ('CSBS', 'CSBS', 'Computer Science & Business Systems', 'A TCS-aligned curriculum blending core CS — DSA, DBMS, OS — with business, finance, and product thinking. Built for students headed into product engineering and tech-business hybrid roles.', 'linear-gradient(135deg,#1E4FDB,#3D8BFF)', 1),
  ('CSE', 'CSE', 'Computer Science & Engineering', 'The core computing track — algorithms, systems, networks, and software engineering. The largest resource-sharing department on REWARE, with the deepest archive of PYQs and lab manuals.', 'linear-gradient(135deg,#0B1E4D,#1E4FDB)', 2),
  ('AIDS', 'AI & DS', 'Artificial Intelligence & Data Science', 'Statistics, data engineering, and applied ML — turning raw data into decisions. Popular resource categories here are Python notes, ML assignments, and dataset-driven mini-projects.', 'linear-gradient(135deg,#FF8A00,#FFB74D)', 3),
  ('AIML', 'AI & ML', 'Artificial Intelligence & Machine Learning', 'Deep learning, neural networks, and intelligent systems design. Expect heavier coding-resource traffic here — model notebooks, architecture notes, and research-paper summaries.', 'linear-gradient(135deg,#3D8BFF,#7EB2FF)', 4),
  ('VLSI', 'VLSI Design', 'VLSI & Embedded Systems', 'Chip design, digital logic, and embedded hardware — from HDL fundamentals to fabrication basics. A smaller but highly focused department archive of lab records and circuit notes.', 'linear-gradient(135deg,#132B63,#1E4FDB)', 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  full_name = EXCLUDED.full_name,
  description = EXCLUDED.description,
  icon_gradient = EXCLUDED.icon_gradient;

-- Initial Resources (14 Sample Resources from the Original Platform)
INSERT INTO public.resources (title, subject, type, dept_id, semester, uploader_name, downloads_count, description, created_at)
VALUES
  ('Data Structures Complete Notes', 'Data Structures (CS3351)', 'Notes', 'CSE', '2nd Year', 'Prof. R. Kumar', 124, 'Comprehensive unit-by-unit handwritten notes covering Arrays, Stacks, Queues, Trees, Graphs, and Hash Tables.', NOW() - INTERVAL '2 days'),
  ('DSA Assignment 2 Solution', 'Data Structures (CS3351)', 'Assignments', 'CSE', '2nd Year', 'Aashita R', 89, 'Detailed working code and explanations for Trees and Graph traversal assignment problems.', NOW() - INTERVAL '5 days'),
  ('Data Structures PYQ — May 2024', 'Data Structures (CS3351)', 'Previous Year Paper', 'CSE', '2nd Year', 'Prof. R. Kumar', 256, 'Official Anna University semester exam question paper with answer keys.', NOW() - INTERVAL '7 days'),
  ('Operating Systems Important Questions', 'Operating Systems (CS3301)', 'Important Questions', 'CSE', '3rd Year', 'Prof. S. Meena', 173, 'Curated list of 2-mark and 16-mark repeating questions for CPU Scheduling, Deadlocks, Memory Management.', NOW() - INTERVAL '7 days'),
  ('Python Basics Programs', 'Python (GE3151)', 'Coding Resources', 'CSBS', '1st Year', 'Bhavan S', 312, '50+ solved beginner to intermediate lab programs with comments and execution output.', NOW() - INTERVAL '7 days'),
  ('Database Management System Notes', 'DBMS (CS3401)', 'Notes', 'CSBS', '2nd Year', 'Prof. J. Priya', 198, 'Complete ER Diagram, Relational Algebra, SQL Queries, and Normalization lecture notes.', NOW() - INTERVAL '14 days'),
  ('DBMS Assignment 1 Solution', 'DBMS (CS3401)', 'Assignments', 'CSBS', '2nd Year', 'Akash M', 102, 'Complex SQL subqueries and join operation solutions with schema definitions.', NOW() - INTERVAL '14 days'),
  ('DBMS PYQ — Nov 2023', 'DBMS (CS3401)', 'Previous Year Paper', 'CSBS', '2nd Year', 'Prof. J. Priya', 145, 'Previous semester question paper with solved university problems.', NOW() - INTERVAL '21 days'),
  ('Machine Learning Assignment 3', 'Machine Learning (AL3451)', 'Assignments', 'AIML', '3rd Year', 'Divya K', 167, 'Decision trees, Random Forests, and SVM classification model implementation notebook.', NOW() - INTERVAL '3 days'),
  ('AI Fundamentals Notes', 'Artificial Intelligence (AL3391)', 'Notes', 'AIML', '3rd Year', 'Prof. N. Iyer', 220, 'Heuristic search strategies, A*, Minimax algorithm, and Knowledge Representation notes.', NOW() - INTERVAL '9 days'),
  ('Data Science with Python Notebook', 'Data Science (AD3491)', 'Coding Resources', 'AIDS', '3rd Year', 'Prof. K. Suresh', 189, 'NumPy, Pandas, Matplotlib, and Seaborn EDA workbook for real-world datasets.', NOW() - INTERVAL '4 days'),
  ('Statistics Important Questions', 'Statistics for DS (AD3491)', 'Important Questions', 'AIDS', '2nd Year', 'Meera V', 96, 'Key derivations for Probability distributions, Hypothesis Testing, and ANOVA.', NOW() - INTERVAL '11 days'),
  ('VLSI Design Lab Manual', 'Digital IC Design (EC3492)', 'Notes', 'VLSI', '3rd Year', 'Prof. A. Raj', 78, 'Cadence tool step-by-step tutorial, inverter layout, and timing analysis instructions.', NOW() - INTERVAL '6 days'),
  ('VLSI Circuits PYQ — 2023', 'VLSI Design (EC3491)', 'Previous Year Paper', 'VLSI', '3rd Year', 'Prof. A. Raj', 64, 'Past Anna University board exam paper for CMOS and Combinational logic circuits.', NOW() - INTERVAL '18 days');
