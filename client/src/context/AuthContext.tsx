import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { UserProfile } from '../types/index.js';
import {
  supabase,
  signInWithSupabase,
  signUpWithSupabase,
  signInWithGoogle,
  signOutWithSupabase
} from '../services/supabase.js';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('ritresources_user') || localStorage.getItem('rewareUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            loggedIn: true
          };
          setUser(profile);
          localStorage.setItem('ritresources_user', JSON.stringify(profile));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            loggedIn: true
          };
          setUser(profile);
          localStorage.setItem('ritresources_user', JSON.stringify(profile));
        } else {
          setUser(null);
          localStorage.removeItem('ritresources_user');
          localStorage.removeItem('rewareUser');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const login = async (email: string, password: string) => {
    const profile = await signInWithSupabase(email, password);
    setUser(profile);
    localStorage.setItem('ritresources_user', JSON.stringify(profile));
  };

  const signup = async (name: string, email: string, password: string) => {
    const profile = await signUpWithSupabase(email, password, name);
    setUser(profile);
    localStorage.setItem('ritresources_user', JSON.stringify(profile));
  };

  const loginWithGoogle = async () => {
    await signInWithGoogle();
  };

  const logout = async () => {
    await signOutWithSupabase();
    setUser(null);
    localStorage.removeItem('ritresources_user');
    localStorage.removeItem('rewareUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
