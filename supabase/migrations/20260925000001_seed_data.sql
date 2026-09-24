-- =========================================================
-- REWARE Academic Resource Sharing Platform
-- Supabase Migration: Seed Departments & Initial Resources
-- =========================================================

-- Seed 5 Core Departments
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
  icon_gradient = EXCLUDED.icon_gradient,
  display_order = EXCLUDED.display_order;

-- Seed Initial Resources (14 Sample Resources)
INSERT INTO public.resources (title, subject, type, dept_id, semester, uploader_name, downloads_count, description, created_at, file_name, file_size, file_type)
VALUES
  ('Data Structures Complete Notes', 'Data Structures (CS3351)', 'Notes', 'CSE', '2nd Year', 'Prof. R. Kumar', 124, 'Comprehensive unit-by-unit handwritten notes covering Arrays, Stacks, Queues, Trees, Graphs, and Hash Tables.', NOW() - INTERVAL '2 days', 'data-structures-notes.pdf', 4850000, 'application/pdf'),
  ('DSA Assignment 2 Solution', 'Data Structures (CS3351)', 'Assignments', 'CSE', '2nd Year', 'Aashita R', 89, 'Detailed working code and explanations for Trees and Graph traversal assignment problems.', NOW() - INTERVAL '5 days', 'dsa-assignment2-solution.pdf', 2150000, 'application/pdf'),
  ('Data Structures PYQ — May 2024', 'Data Structures (CS3351)', 'Previous Year Paper', 'CSE', '2nd Year', 'Prof. R. Kumar', 256, 'Official Anna University semester exam question paper with answer keys.', NOW() - INTERVAL '7 days', 'ds-pyq-may-2024.pdf', 1720000, 'application/pdf'),
  ('Operating Systems Important Questions', 'Operating Systems (CS3301)', 'Important Questions', 'CSE', '3rd Year', 'Prof. S. Meena', 173, 'Curated list of 2-mark and 16-mark repeating questions for CPU Scheduling, Deadlocks, Memory Management.', NOW() - INTERVAL '7 days', 'os-imp-questions.pdf', 980000, 'application/pdf'),
  ('Python Basics Programs', 'Python (GE3151)', 'Coding Resources', 'CSBS', '1st Year', 'Bhavan S', 312, '50+ solved beginner to intermediate lab programs with comments and execution output.', NOW() - INTERVAL '7 days', 'python-basics-lab.zip', 8400000, 'application/zip'),
  ('Database Management System Notes', 'DBMS (CS3401)', 'Notes', 'CSBS', '2nd Year', 'Prof. J. Priya', 198, 'Complete ER Diagram, Relational Algebra, SQL Queries, and Normalization lecture notes.', NOW() - INTERVAL '14 days', 'dbms-complete-notes.pdf', 6100000, 'application/pdf'),
  ('DBMS Assignment 1 Solution', 'DBMS (CS3401)', 'Assignments', 'CSBS', '2nd Year', 'Akash M', 102, 'Complex SQL subqueries and join operation solutions with schema definitions.', NOW() - INTERVAL '14 days', 'dbms-assignment1.pdf', 1450000, 'application/pdf'),
  ('DBMS PYQ — Nov 2023', 'DBMS (CS3401)', 'Previous Year Paper', 'CSBS', '2nd Year', 'Prof. J. Priya', 145, 'Previous semester question paper with solved university problems.', NOW() - INTERVAL '21 days', 'dbms-pyq-nov-2023.pdf', 1650000, 'application/pdf'),
  ('Machine Learning Assignment 3', 'Machine Learning (AL3451)', 'Assignments', 'AIML', '3rd Year', 'Divya K', 167, 'Decision trees, Random Forests, and SVM classification model implementation notebook.', NOW() - INTERVAL '3 days', 'ml-assignment3.pdf', 3200000, 'application/pdf'),
  ('AI Fundamentals Notes', 'Artificial Intelligence (AL3391)', 'Notes', 'AIML', '3rd Year', 'Prof. N. Iyer', 220, 'Heuristic search strategies, A*, Minimax algorithm, and Knowledge Representation notes.', NOW() - INTERVAL '9 days', 'ai-fundamentals.pdf', 5400000, 'application/pdf'),
  ('Data Science with Python Notebook', 'Data Science (AD3491)', 'Coding Resources', 'AIDS', '3rd Year', 'Prof. K. Suresh', 189, 'NumPy, Pandas, Matplotlib, and Seaborn EDA workbook for real-world datasets.', NOW() - INTERVAL '4 days', 'ds-python-notebook.zip', 11200000, 'application/zip'),
  ('Statistics Important Questions', 'Statistics for DS (AD3491)', 'Important Questions', 'AIDS', '2nd Year', 'Meera V', 96, 'Key derivations for Probability distributions, Hypothesis Testing, and ANOVA.', NOW() - INTERVAL '11 days', 'stats-important-questions.pdf', 1200000, 'application/pdf'),
  ('VLSI Design Lab Manual', 'Digital IC Design (EC3492)', 'Notes', 'VLSI', '3rd Year', 'Prof. A. Raj', 78, 'Cadence tool step-by-step tutorial, inverter layout, and timing analysis instructions.', NOW() - INTERVAL '6 days', 'vlsi-lab-manual.pdf', 7800000, 'application/pdf'),
  ('VLSI Circuits PYQ — 2023', 'VLSI Design (EC3491)', 'Previous Year Paper', 'VLSI', '3rd Year', 'Prof. A. Raj', 64, 'Past Anna University board exam paper for CMOS and Combinational logic circuits.', NOW() - INTERVAL '18 days', 'vlsi-pyq-2023.pdf', 1900000, 'application/pdf')
ON CONFLICT DO NOTHING;
