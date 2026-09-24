import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.js';

const defaultUrl = 'https://luchjlscqadbnzmbpqgd.supabase.co';
const defaultAnonKey = 'sb_publishable_olaVAzBkR_sHABnP6IpHfQ_V6BPuanu';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('your-project')
    ? import.meta.env.VITE_SUPABASE_URL
    : defaultUrl;

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY && !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your-anon-key')
    ? import.meta.env.VITE_SUPABASE_ANON_KEY
    : defaultAnonKey;

// Client-side Supabase instance using only the public anon key with resilient fallback
export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey);
