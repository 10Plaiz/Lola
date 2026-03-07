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
  sendOnboardingOtp: (email: string) => Promise<void>;
  completeOnboarding: (email: string, token: string, password: string, phone: string) => Promise<void>;
  loading: boolean;
  onboardingPending: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingPending, setOnboardingPending] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Set cookie for server-side authentication
        document.cookie = `token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        
        const isNewGoogleUser = session.user.app_metadata.provider === 'google' && !session.user.user_metadata.onboarding_completed;
        if (isNewGoogleUser) {
          setOnboardingPending(true);
        }

        setUser({
          username: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          phone: session.user.user_metadata.phone || '',
          role: session.user.user_metadata.role || 'customer',
          onboardingCompleted: session.user.user_metadata.onboarding_completed || false
        });
      }
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // Set cookie for server-side authentication
        document.cookie = `token=${session.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        
        const isNewGoogleUser = session.user.app_metadata.provider === 'google' && !session.user.user_metadata.onboarding_completed;
        if (isNewGoogleUser) {
          setOnboardingPending(true);
        }

        setUser({
          username: session.user.user_metadata.username || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          phone: session.user.user_metadata.phone || '',
          role: session.user.user_metadata.role || 'customer',
          onboardingCompleted: session.user.user_metadata.onboarding_completed || false
        });
      } else {
        // Clear cookie
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        setUser(null);
        setOnboardingPending(false);
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
      type: 'email'
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
          role: 'customer',
          onboarding_completed: true
        }
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setOnboardingPending(false);
  };

  const sendOnboardingOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false
      }
    });
    if (error) throw error;
  };

  const completeOnboarding = async (email: string, token: string, password: string, phone: string) => {
    // 1. Verify OTP (skip if user clicked Magic Link and is already verified)
    if (token !== 'LINK_VERIFIED') {
      const { error: otpError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });
      if (otpError) throw otpError;
    }

    // 2. Set password and mark onboarding as complete
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
      data: { 
        onboarding_completed: true,
        phone: phone
      }
    });
    if (updateError) throw updateError;

    setOnboardingPending(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle, 
      verifyOtp, 
      resetPassword, 
      updatePassword, 
      signup, 
      logout, 
      sendOnboardingOtp,
      completeOnboarding,
      loading,
      onboardingPending
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
