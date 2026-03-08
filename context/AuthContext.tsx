import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (username: string, email: string, phone: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyOtp: (email: string, token: string, type: 'recovery' | 'signup') => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  completeProfile: (phone: string, password?: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        document.cookie = `sb-access-token=${session.access_token}; path=/; SameSite=None; Secure`;
        
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const { user: profile } = await response.json();
            if (profile) {
              setUser(profile);
            }
          } else if (response.status === 401) {
            console.warn('Backend returned 401. Session might be invalid or credentials mismatch.');
          }
        } catch (err) {
          console.error('Error fetching profile from backend:', err);
        }
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        document.cookie = `sb-access-token=${session.access_token}; path=/; SameSite=None; Secure`;
        
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            const { user: profile } = await response.json();
            if (profile) {
              setUser(profile);
            }
          }
        } catch (err) {
          console.error('Error fetching profile from backend on auth change:', err);
        }
      } else {
        setUser(null);
        document.cookie = 'sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure';
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    if (!password) throw new Error('Password is required');
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
    if (error) throw error;
  };

  const signup = async (username: string, email: string, phone: string, password?: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    if (!password) throw new Error('Password is required');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          phone,
        }
      }
    });
    if (error) throw error;

    if (data.user && data.user.identities && data.user.identities.length === 0) {
      throw new Error("This email is already taken.");
    }

    if (data.user) {
      try {
        const response = await fetch('/api/auth/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, phone }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error creating profile via backend:', errorData);
        }
      } catch (err) {
        console.error('Failed to call create-profile API:', err);
      }
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  const verifyOtp = async (email: string, token: string, type: 'recovery' | 'signup') => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.auth.verifyOtp({ email, token, type });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  const completeProfile = async (phone: string, password?: string) => {
    if (!supabase) throw new Error('Supabase is not configured.');
    
    // Update password if provided
    if (password) {
      const { error: passError } = await supabase.auth.updateUser({ password });
      if (passError) throw passError;
    }

    // Update profile via backend
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      try {
        const response = await fetch('/api/auth/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User', 
            phone 
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create profile');
        }
        
        // Refresh session to get updated profile
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const meResponse = await fetch('/api/auth/me');
          if (meResponse.ok) {
            const { user: profile } = await meResponse.json();
            if (profile) setUser(profile);
          }
        }
      } catch (err: any) {
        throw new Error(err.message || 'Failed to complete profile');
      }
    }
  };

  const logout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, loginWithGoogle, signup, logout, 
      resetPassword, verifyOtp, updatePassword, completeProfile, loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
