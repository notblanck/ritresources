import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseAuthEnabled = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseAuthEnabled
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function signUpWithSupabase(email: string, password: string, name: string) {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });
    if (error) throw error;
    return {
      id: data.user?.id,
      email: data.user?.email || email,
      name: name || email.split('@')[0],
      loggedIn: true
    };
  }

  // Fallback demo auth
  return {
    id: 'demo-user-' + Date.now(),
    email,
    name: name || email.split('@')[0],
    loggedIn: true
  };
}

export async function signInWithSupabase(email: string, password: string) {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return {
      id: data.user?.id,
      email: data.user?.email || email,
      name: data.user?.user_metadata?.full_name || email.split('@')[0],
      loggedIn: true
    };
  }

  // Fallback demo auth
  return {
    id: 'demo-user-1',
    email,
    name: email.split('@')[0],
    loggedIn: true
  };
}

export async function signOutWithSupabase() {
  if (supabase) {
    await supabase.auth.signOut();
  }
}
