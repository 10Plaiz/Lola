import React, { useState } from 'react';
import { Mail, Lock, CheckCircle, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const OnboardingModal: React.FC = () => {
  const { user, sendOnboardingOtp, completeOnboarding, logout, onboardingPending } = useAuth();
  const [step, setStep] = useState<'initial' | 'otp' | 'password'>('initial');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!onboardingPending || !user) return null;

  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      await sendOnboardingOtp(user.email);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await completeOnboarding(user.email, otp, password);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check your OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-coffee-900/80 backdrop-blur-md"></div>
      
      <div className="relative bg-cream w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up border border-coffee-200">
        <div className="bg-coffee-600 p-8 text-center relative">
          <button 
            onClick={() => logout()}
            className="absolute top-4 right-4 text-coffee-200 hover:text-white transition-colors"
            title="Sign Out"
          >
            <X size={24} />
          </button>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white mb-1">Complete Your Setup</h2>
          <p className="text-coffee-100 text-sm">Welcome to Lola's! Since this is your first time, let's secure your account.</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-2xl flex items-start gap-3">
              <div className="mt-0.5">⚠️</div>
              {error}
            </div>
          )}

          {step === 'initial' && (
            <div className="space-y-6 text-center">
              <div className="p-4 bg-coffee-50 rounded-2xl border border-coffee-100">
                <p className="text-coffee-700 text-sm leading-relaxed">
                  We'll send a one-time password (OTP) to <span className="font-bold text-coffee-900">{user.email}</span> to verify your identity.
                </p>
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-coffee-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-coffee-700 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
                <ArrowRight size={20} />
              </button>
            </div>
          )}

          {(step === 'otp' || step === 'password') && (
            <form onSubmit={handleVerifyAndSetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-coffee-700 uppercase tracking-widest ml-1">Verification Code</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" size={20} />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-coffee-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                    placeholder="Enter 6-digit code"
                  />
                </div>
                <p className="text-[10px] text-coffee-500 ml-1">Check your email for the code we just sent.</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-coffee-700 uppercase tracking-widest ml-1">Create Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" size={20} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-coffee-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-coffee-700 uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" size={20} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-coffee-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 placeholder-coffee-300 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-coffee-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-coffee-700 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Complete Setup'}
                <CheckCircle size={20} />
              </button>
              
              <button
                type="button"
                onClick={() => setStep('initial')}
                className="w-full text-coffee-500 text-sm font-bold hover:text-coffee-700 transition-colors"
              >
                Didn't get the code? Resend
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-coffee-100 text-center">
            <button 
              onClick={() => logout()}
              className="text-xs font-bold text-coffee-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              Cancel and Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;
