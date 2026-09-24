import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY) are missing. Check client/.env.'
  );
}

// Client-side Supabase instance using only the public anon key
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
