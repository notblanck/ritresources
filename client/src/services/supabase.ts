import { supabase } from '../lib/supabaseClient.js';

export const isSupabaseAuthEnabled = Boolean(
  import.meta.env.VITE_SUPABASE_URL &&
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('your-project')
);

export { supabase };

export async function signUpWithSupabase(email: string, password: string, name: string) {
  if (isSupabaseAuthEnabled && supabase) {
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
  if (isSupabaseAuthEnabled && supabase) {
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
  if (isSupabaseAuthEnabled && supabase) {
    await supabase.auth.signOut();
  }
}
