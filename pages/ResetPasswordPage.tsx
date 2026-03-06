import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-coffee-100 overflow-hidden">
        <div className="bg-coffee-600 p-8 text-center">
          <h1 className="text-2xl font-serif font-bold text-white">Set New Password</h1>
          <p className="text-coffee-100 text-sm mt-2">Please enter your new password below.</p>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-coffee-900">Password Updated!</h2>
              <p className="text-coffee-600">Your password has been successfully changed. Redirecting you to home...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl flex items-center gap-3 text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-coffee-700 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" size={20} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-coffee-50 border border-coffee-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-coffee-700 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-400" size={20} />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-coffee-50 border border-coffee-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coffee-500 text-coffee-900 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-coffee-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-coffee-700 transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
