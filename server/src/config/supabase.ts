import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { Resource, Department } from '../types/index.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export let supabase: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project')
  );
};

if (isSupabaseConfigured()) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Connected to Supabase project:', supabaseUrl);
  } catch (err) {
    console.warn('⚠️ Failed to initialize Supabase client, using fallback data store:', err);
    supabase = null;
  }
} else {
  console.log('ℹ️ Supabase environment variables not configured yet. Operating in active fallback mode.');
}

// ==========================================
// Default in-memory seed data
// ==========================================
export const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: 'CSBS',
    name: 'CSBS',
    full_name: 'Computer Science & Business Systems',
    description: 'A TCS-aligned curriculum blending core CS — DSA, DBMS, OS — with business, finance, and product thinking. Built for students headed into product engineering and tech-business hybrid roles.',
    icon_gradient: 'linear-gradient(135deg,#1E4FDB,#3D8BFF)',
    display_order: 1
  },
  {
    id: 'CSE',
    name: 'CSE',
    full_name: 'Computer Science & Engineering',
    description: 'The core computing track — algorithms, systems, networks, and software engineering. The largest resource-sharing department on ritresources, with the deepest archive of PYQs and lab manuals.',
    icon_gradient: 'linear-gradient(135deg,#0B1E4D,#1E4FDB)',
    display_order: 2
  },
  {
    id: 'AIDS',
    name: 'AI & DS',
    full_name: 'Artificial Intelligence & Data Science',
    description: 'Statistics, data engineering, and applied ML — turning raw data into decisions. Popular resource categories here are Python notes, ML assignments, and dataset-driven mini-projects.',
    icon_gradient: 'linear-gradient(135deg,#FF8A00,#FFB74D)',
    display_order: 3
  },
  {
    id: 'AIML',
    name: 'AI & ML',
    full_name: 'Artificial Intelligence & Machine Learning',
    description: 'Deep learning, neural networks, and intelligent systems design. Expect heavier coding-resource traffic here — model notebooks, architecture notes, and research-paper summaries.',
    icon_gradient: 'linear-gradient(135deg,#3D8BFF,#7EB2FF)',
    display_order: 4
  },
  {
    id: 'VLSI',
    name: 'VLSI Design',
    full_name: 'VLSI & Embedded Systems',
    description: 'Chip design, digital logic, and embedded hardware — from HDL fundamentals to fabrication basics. A smaller but highly focused department archive of lab records and circuit notes.',
    icon_gradient: 'linear-gradient(135deg,#132B63,#1E4FDB)',
    display_order: 5
  }
];

export const DEFAULT_RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Data Structures Complete Notes',
    subject: 'Data Structures (CS3351)',
    type: 'Notes',
    dept_id: 'CSE',
    semester: '2nd Year',
    uploader_name: 'Prof. R. Kumar',
    downloads_count: 124,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    description: 'Comprehensive unit-by-unit handwritten notes covering Arrays, Stacks, Queues, Trees, Graphs, and Hash Tables.',
    file_name: 'data-structures-notes.pdf',
    file_size: 4850000,
    file_type: 'application/pdf'
  },
  {
    id: '2',
    title: 'DSA Assignment 2 Solution',
    subject: 'Data Structures (CS3351)',
    type: 'Assignments',
    dept_id: 'CSE',
    semester: '2nd Year',
    uploader_name: 'Aashita R',
    downloads_count: 89,
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    description: 'Detailed working code and explanations for Trees and Graph traversal assignment problems.',
    file_name: 'dsa-assignment2-solution.pdf',
    file_size: 2150000,
    file_type: 'application/pdf'
  },
  {
    id: '3',
    title: 'Data Structures PYQ — May 2024',
    subject: 'Data Structures (CS3351)',
    type: 'Previous Year Paper',
    dept_id: 'CSE',
    semester: '2nd Year',
    uploader_name: 'Prof. R. Kumar',
    downloads_count: 256,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    description: 'Official Anna University semester exam question paper with answer keys.',
    file_name: 'ds-pyq-may-2024.pdf',
    file_size: 1720000,
    file_type: 'application/pdf'
  },
  {
    id: '4',
    title: 'Operating Systems Important Questions',
    subject: 'Operating Systems (CS3301)',
    type: 'Important Questions',
    dept_id: 'CSE',
    semester: '3rd Year',
    uploader_name: 'Prof. S. Meena',
    downloads_count: 173,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    description: 'Curated list of 2-mark and 16-mark repeating questions for CPU Scheduling, Deadlocks, Memory Management.',
    file_name: 'os-imp-questions.pdf',
    file_size: 980000,
    file_type: 'application/pdf'
  },
  {
    id: '5',
    title: 'Python Basics Programs',
    subject: 'Python (GE3151)',
    type: 'Coding Resources',
    dept_id: 'CSBS',
    semester: '1st Year',
    uploader_name: 'Bhavan S',
    downloads_count: 312,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    description: '50+ solved beginner to intermediate lab programs with comments and execution output.',
    file_name: 'python-basics-lab.zip',
    file_size: 8400000,
    file_type: 'application/zip'
  },
  {
    id: '6',
    title: 'Database Management System Notes',
    subject: 'DBMS (CS3401)',
    type: 'Notes',
    dept_id: 'CSBS',
    semester: '2nd Year',
    uploader_name: 'Prof. J. Priya',
    downloads_count: 198,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    description: 'Complete ER Diagram, Relational Algebra, SQL Queries, and Normalization lecture notes.',
    file_name: 'dbms-complete-notes.pdf',
    file_size: 6100000,
    file_type: 'application/pdf'
  },
  {
    id: '7',
    title: 'DBMS Assignment 1 Solution',
    subject: 'DBMS (CS3401)',
    type: 'Assignments',
    dept_id: 'CSBS',
    semester: '2nd Year',
    uploader_name: 'Akash M',
    downloads_count: 102,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    description: 'Complex SQL subqueries and join operation solutions with schema definitions.',
    file_name: 'dbms-assignment1.pdf',
    file_size: 1450000,
    file_type: 'application/pdf'
  },
  {
    id: '8',
    title: 'DBMS PYQ — Nov 2023',
    subject: 'DBMS (CS3401)',
    type: 'Previous Year Paper',
    dept_id: 'CSBS',
    semester: '2nd Year',
    uploader_name: 'Prof. J. Priya',
    downloads_count: 145,
    created_at: new Date(Date.now() - 21 * 86400000).toISOString(),
    description: 'Previous semester question paper with solved university problems.',
    file_name: 'dbms-pyq-nov-2023.pdf',
    file_size: 1650000,
    file_type: 'application/pdf'
  },
  {
    id: '9',
    title: 'Machine Learning Assignment 3',
    subject: 'Machine Learning (AL3451)',
    type: 'Assignments',
    dept_id: 'AIML',
    semester: '3rd Year',
    uploader_name: 'Divya K',
    downloads_count: 167,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    description: 'Decision trees, Random Forests, and SVM classification model implementation notebook.',
    file_name: 'ml-assignment3.pdf',
    file_size: 3200000,
    file_type: 'application/pdf'
  },
  {
    id: '10',
    title: 'AI Fundamentals Notes',
    subject: 'Artificial Intelligence (AL3391)',
    type: 'Notes',
    dept_id: 'AIML',
    semester: '3rd Year',
    uploader_name: 'Prof. N. Iyer',
    downloads_count: 220,
    created_at: new Date(Date.now() - 9 * 86400000).toISOString(),
    description: 'Heuristic search strategies, A*, Minimax algorithm, and Knowledge Representation notes.',
    file_name: 'ai-fundamentals.pdf',
    file_size: 5400000,
    file_type: 'application/pdf'
  },
  {
    id: '11',
    title: 'Data Science with Python Notebook',
    subject: 'Data Science (AD3491)',
    type: 'Coding Resources',
    dept_id: 'AIDS',
    semester: '3rd Year',
    uploader_name: 'Prof. K. Suresh',
    downloads_count: 189,
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    description: 'NumPy, Pandas, Matplotlib, and Seaborn EDA workbook for real-world datasets.',
    file_name: 'ds-python-notebook.zip',
    file_size: 11200000,
    file_type: 'application/zip'
  },
  {
    id: '12',
    title: 'Statistics Important Questions',
    subject: 'Statistics for DS (AD3491)',
    type: 'Important Questions',
    dept_id: 'AIDS',
    semester: '2nd Year',
    uploader_name: 'Meera V',
    downloads_count: 96,
    created_at: new Date(Date.now() - 11 * 86400000).toISOString(),
    description: 'Key derivations for Probability distributions, Hypothesis Testing, and ANOVA.',
    file_name: 'stats-important-questions.pdf',
    file_size: 1200000,
    file_type: 'application/pdf'
  },
  {
    id: '13',
    title: 'VLSI Design Lab Manual',
    subject: 'Digital IC Design (EC3492)',
    type: 'Notes',
    dept_id: 'VLSI',
    semester: '3rd Year',
    uploader_name: 'Prof. A. Raj',
    downloads_count: 78,
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    description: 'Cadence tool step-by-step tutorial, inverter layout, and timing analysis instructions.',
    file_name: 'vlsi-lab-manual.pdf',
    file_size: 7800000,
    file_type: 'application/pdf'
  },
  {
    id: '14',
    title: 'VLSI Circuits PYQ — 2023',
    subject: 'VLSI Design (EC3491)',
    type: 'Previous Year Paper',
    dept_id: 'VLSI',
    semester: '3rd Year',
    uploader_name: 'Prof. A. Raj',
    downloads_count: 64,
    created_at: new Date(Date.now() - 18 * 86400000).toISOString(),
    description: 'Past Anna University board exam paper for CMOS and Combinational logic circuits.',
    file_name: 'vlsi-pyq-2023.pdf',
    file_size: 1900000,
    file_type: 'application/pdf'
  }
];
