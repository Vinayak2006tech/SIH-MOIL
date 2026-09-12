import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import { api } from '../services/api';

interface ResetPasswordPageProps {
  onGoToLogin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ onGoToLogin }) => {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    const urlEmail = params.get('email');
    if (urlToken) setToken(urlToken);
    if (urlEmail) setEmail(urlEmail);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token.trim()) {
      setError('Reset token is required. Please check your recovery email.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword(token.trim(), password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed. The link may have expired or is invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1214] text-[#E8E6E3] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-tech-teal/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md glass-panel bg-[#161D22]/95 border border-[#26333B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
        <button
          onClick={onGoToLogin}
          className="text-xs text-[#94A3B8] hover:text-[#E8E6E3] flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-manganese-700 via-tech-teal/80 to-tech-teal border border-tech-teal/30 flex items-center justify-center text-[#0F1214] shadow-glow-teal">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#E8E6E3] tracking-tight">
            Set New Password
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            {email ? `Updating security password for ${email}` : 'Enter your reset token and configure your new password'}
          </p>
        </div>

        {success ? (
          <div className="space-y-5 text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 bg-tech-teal/20 border border-tech-teal/40 rounded-full flex items-center justify-center mx-auto text-tech-teal">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#E8E6E3]">Password Successfully Updated!</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Your MOIL ReserveIQ security password has been updated. You can now log in with your new password.
              </p>
            </div>
            <button
              onClick={onGoToLogin}
              className="w-full py-3 bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-[#0F1214] font-extrabold rounded-xl shadow-glow-teal transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {!token && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block text-[11px]">Security Reset Token</label>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter token from reset email"
                    className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] font-mono text-xs focus:outline-none focus:border-tech-teal"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-tech-teal"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-tech-teal"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-[#0F1214] font-extrabold rounded-xl shadow-glow-teal transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
              >
                <span>{loading ? 'Updating Password...' : 'Save New Password & Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
