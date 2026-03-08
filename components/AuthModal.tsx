import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot_password' | 'verify_otp' | 'reset_password' | 'complete_profile';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot_password' | 'verify_otp' | 'reset_password' | 'complete_profile'>(initialMode);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle, resetPassword, verifyOtp, updatePassword, completeProfile, user } = useAuth();

  // Reset mode when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setMessage(null);
      setFormData({ username: '', email: '', phone: '', password: '', confirmPassword: '', otp: '' });
    } else {
      setFormData({ username: '', email: '', phone: '', password: '', confirmPassword: '', otp: '' });
    }
  }, [isOpen, initialMode]);

  const switchMode = (newMode: typeof mode) => {
    setMode(newMode);
    setError(null);
    setMessage(null);
    setFormData({ username: '', email: '', phone: '', password: '', confirmPassword: '', otp: '' });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      if ((mode === 'signup' || mode === 'complete_profile') && formData.phone.length !== 10) {
        throw new Error("Phone number must be exactly 10 digits");
      }

      if (mode === 'login') {
        await login(formData.email, formData.password);
        onClose();
      } else if (mode === 'signup') {
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match");
        await signup(formData.username, formData.email, formData.phone, formData.password);
        onClose();
      } else if (mode === 'forgot_password') {
        await resetPassword(formData.email);
        setMessage('OTP sent to your email. Please check your inbox.');
        setMode('verify_otp');
      } else if (mode === 'verify_otp') {
        await verifyOtp(formData.email, formData.otp, 'recovery');
        setMessage('OTP verified. Please set your new password.');
        setMode('reset_password');
      } else if (mode === 'reset_password') {
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match");
        await updatePassword(formData.password);
        setMessage('Password updated successfully. You can now sign in.');
        setMode('login');
      } else if (mode === 'complete_profile') {
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match");
        await completeProfile(formData.phone, formData.password);
        onClose();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'phone') {
      const val = e.target.value.replace(/\D/g, '');
      if (val.length > 10) return;
      setFormData({ ...formData, phone: val });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Join the Family';
      case 'forgot_password': return 'Reset Password';
      case 'verify_otp': return 'Enter OTP';
      case 'reset_password': return 'New Password';
      case 'complete_profile': return 'Complete Profile';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to access your rewards';
      case 'signup': return 'Create an account to start earning points';
      case 'forgot_password': return 'Enter your email to receive an OTP';
      case 'verify_otp': return 'Enter the OTP sent to your email';
      case 'reset_password': return 'Create a new secure password';
      case 'complete_profile': return 'Please complete your profile details';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-coffee-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => mode !== 'complete_profile' && onClose()}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-cream w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-coffee-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-coffee-600 p-6 text-center relative">
          {mode !== 'complete_profile' && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-coffee-200 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          )}
          <h2 className="text-2xl font-serif font-bold text-white mb-1">
            {getTitle()}
          </h2>
          <p className="text-coffee-100 text-sm">
            {getSubtitle()}
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {(mode === 'login' || mode === 'signup' || mode === 'forgot_password' || mode === 'verify_otp') && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee-700 uppercase tracking-wide ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={mode === 'verify_otp'}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-coffee-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="juan@example.com"
                  />
                </div>
              </div>
            )}

            {mode === 'verify_otp' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee-700 uppercase tracking-wide ml-1">OTP Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                  <input
                    type="text"
                    name="otp"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-coffee-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                    placeholder="123456"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee-700 uppercase tracking-wide ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                  <input
                    type="text"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-coffee-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                    placeholder="JuanDelaCruz"
                  />
                </div>
              </div>
            )}

            {(mode === 'signup' || mode === 'complete_profile') && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee-700 uppercase tracking-wide ml-1">Phone Number</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 text-coffee-400" size={18} />
                  <div className="absolute left-10 flex items-center gap-1 text-coffee-700 font-medium">
                    <span>+63</span>
                    <div className="w-px h-5 bg-coffee-200 ml-1"></div>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-24 pr-4 py-3 bg-white border border-coffee-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                    placeholder="09171234567"
                  />
                </div>
              </div>
            )}

            {(mode === 'login' || mode === 'signup' || mode === 'reset_password' || mode === 'complete_profile') && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee-700 uppercase tracking-wide ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-coffee-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {(mode === 'signup' || mode === 'reset_password' || mode === 'complete_profile') && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-coffee-700 uppercase tracking-wide ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-coffee-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-coffee-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-coffee-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all mt-6 disabled:opacity-70 disabled:transform-none"
            >
              {loading ? 'Please wait...' : (
                mode === 'login' ? 'Sign In' : 
                mode === 'signup' ? 'Create Account' : 
                mode === 'forgot_password' ? 'Send OTP' :
                mode === 'verify_otp' ? 'Verify OTP' :
                mode === 'reset_password' ? 'Reset Password' :
                'Complete Profile'
              )}
            </button>
          </form>

          {(mode === 'login' || mode === 'signup') && (
            <>
              <div className="mt-6 flex items-center justify-center space-x-4">
                <div className="h-px bg-coffee-200 flex-1"></div>
                <span className="text-xs text-coffee-400 font-bold uppercase tracking-wider">OR</span>
                <div className="h-px bg-coffee-200 flex-1"></div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full mt-6 bg-white border border-coffee-200 text-coffee-800 font-bold py-3 rounded-xl shadow-sm hover:bg-coffee-50 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </button>
            </>
          )}

          {/* Toggle Mode */}
          <div className="mt-6 text-center space-y-2">
            {mode === 'login' && (
              <p>
                <button
                  onClick={() => switchMode('forgot_password')}
                  className="text-sm font-bold text-coffee-600 hover:text-coffee-800 transition-colors"
                >
                  Forgot your password?
                </button>
              </p>
            )}
            
            {(mode === 'login' || mode === 'signup') && (
              <p className="text-coffee-600 text-sm">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                  className="font-bold text-coffee-800 hover:text-coffee-600 underline decoration-2 underline-offset-2 transition-colors"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            )}

            {(mode === 'forgot_password' || mode === 'verify_otp' || mode === 'reset_password') && (
              <p>
                <button
                  onClick={() => switchMode('login')}
                  className="text-sm font-bold text-coffee-600 hover:text-coffee-800 transition-colors"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
