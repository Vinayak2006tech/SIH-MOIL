import React, { useState, useEffect } from 'react';
import { Layers, Lock, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';
import { api } from '../services/api.1';

interface ActivateAccountPageProps {
  onGoToLogin: () => void;
}

export const ActivateAccountPage: React.FC<ActivateAccountPageProps> = ({ onGoToLogin }) => {
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
      setError('Activation token is required. Please check your activation email link.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      await api.activateAccount(token.trim(), password);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to activate account. The link may have expired or is invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md glass-panel bg-slate-900/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
        {/* Header Badges */}
        <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-semibold text-slate-300">MOIL LIMITED • MINIRATNA</span>
          </div>
          <span className="px-2 py-0.5 rounded-full font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px]">
            Account Clearance
          </span>
        </div>

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-glow-emerald">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Activate Official Account
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {email ? `Configure access security for ${email}` : 'Set your permanent password to complete account activation'}
          </p>
        </div>

        {success ? (
          <div className="space-y-5 text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Account Successfully Activated!</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Your credentials and security password have been registered in the MOIL National Mineral Registry.
              </p>
            </div>
            <button
              onClick={onGoToLogin}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Official Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Info notice */}
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 text-xs text-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-white block font-semibold">Administrator Approval Verified</strong>
                Your application has been cleared. Create your private password below to activate your account.
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {!token && (
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block text-[11px]">Activation Security Token</label>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter token from activation email"
                    className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">New Security Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
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
                    placeholder="Re-type password"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
              >
                <span>{loading ? 'Activating Credentials...' : 'Activate Account & Set Password'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-800">
              <button
                onClick={onGoToLogin}
                className="text-xs text-slate-400 hover:text-slate-200 transition"
              >
                Already activated? <span className="text-emerald-400 font-bold underline">Sign in to ReserveIQ</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
