import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../src/lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  signup: (username: string, email: string, phone: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          username: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          phone: session.user.user_metadata.phone || '',
          role: session.user.user_metadata.role || 'customer'
        });
      }
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          username: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          phone: session.user.user_metadata.phone || '',
          role: session.user.user_metadata.role || 'customer'
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error('Password is required');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
  };

  const verifyOtp = async (email: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'magiclink'
    });
    if (error) throw error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password: password
    });
    if (error) throw error;
  };

  const signup = async (username: string, email: string, phone: string, password?: string) => {
    if (!password) throw new Error('Password is required');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          phone,
          role: 'customer'
        }
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, verifyOtp, resetPassword, updatePassword, signup, logout, loading }}>
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
