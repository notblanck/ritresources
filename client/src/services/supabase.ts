import { supabase } from '../lib/supabaseClient.js';

export const isSupabaseAuthEnabled = Boolean(supabase);

export { supabase };

export async function signUpWithSupabase(email: string, password: string, name: string) {
  if (supabase) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });
    if (signUpError) throw signUpError;

    // Attempt instant sign-in since email is auto-confirmed by database trigger
    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (!signInError && signInData?.user) {
        return {
          id: signInData.user.id,
          email: signInData.user.email || email,
          name: signInData.user.user_metadata?.full_name || name || email.split('@')[0],
          loggedIn: true
        };
      }
    } catch {
      // Fallback to signUpData
    }

    return {
      id: signUpData.user?.id,
      email: signUpData.user?.email || email,
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

export async function signInWithGoogle() {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  }
}

export async function signOutWithSupabase() {
  if (supabase) {
    await supabase.auth.signOut();
  }
}
