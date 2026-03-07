import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'> (initialMode);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  // Reset mode when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      // Redirect happens automatically
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        onClose();
      } else if (mode === 'signup') {
        await signup(formData.username, formData.email, formData.phone, formData.password);
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(formData.email);
        setError('Password reset link sent to your email!');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-coffee-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-cream w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up border border-coffee-200 flex flex-col md:flex-row min-h-[500px]">
        
        {/* Left Side: Branding & Social */}
        <div className="md:w-2/5 bg-coffee-600 p-8 text-center flex flex-col justify-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-coffee-400/10 rounded-full blur-3xl"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 text-coffee-200 hover:text-white transition-colors md:hidden"
          >
            <X size={24} />
          </button>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
              <Lock className="text-white" size={32} />
            </div>
            
            <h2 className="text-3xl font-serif font-bold text-white mb-3">
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Join the Family' : 'Reset Password'}
            </h2>
            <p className="text-coffee-100 text-sm mb-8 max-w-[240px] mx-auto leading-relaxed">
              {mode === 'login' ? 'Sign in to access your rewards and favorites.' : mode === 'signup' ? 'Create an account to start earning points and exclusive deals.' : 'Enter your email to receive a reset link.'}
            </p>

            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 bg-white text-coffee-800 font-bold py-3.5 rounded-2xl shadow-lg hover:bg-coffee-50 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>

              <div className="pt-6">
                <p className="text-coffee-200 text-xs font-bold uppercase tracking-widest mb-3">
                  {mode === 'login' ? "New to Lola's?" : mode === 'signup' ? "Already a member?" : "Remembered it?"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (mode === 'forgot') setMode('login');
                    else setMode(mode === 'signup' ? 'login' : 'signup');
                    setError(null);
                  }}
                  className="px-8 py-2.5 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-all"
                >
                  {mode === 'signup' || mode === 'forgot' ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-3/5 p-8 md:p-12 bg-cream relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-coffee-400 hover:text-coffee-900 transition-colors hidden md:block"
          >
            <X size={24} />
          </button>

          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <h3 className="text-xl font-serif font-bold text-coffee-900 mb-1">
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Forgot Password'}
              </h3>
              <div className="w-12 h-1 bg-coffee-600 rounded-full"></div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl flex items-start gap-3 animate-shake">
                <div className="mt-0.5">⚠️</div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {mode === 'signup' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-coffee-700 uppercase tracking-widest ml-1">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                      <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-coffee-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                        placeholder="JuanDelaCruz"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-coffee-700 uppercase tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-coffee-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                        placeholder="09171234567"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-coffee-700 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-white border border-coffee-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                    placeholder="juan@example.com"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-coffee-700 uppercase tracking-widest">Password</label>
                    {mode === 'login' && (
                      <button 
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[10px] font-bold text-coffee-500 hover:text-coffee-800 transition-colors uppercase tracking-widest"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" size={18} />
                    <input
                      type="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-coffee-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-coffee-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-coffee-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-8 text-[10px] text-coffee-400 text-center leading-relaxed">
              By continuing, you agree to Lola's by Kape Garahe's <br />
              <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
