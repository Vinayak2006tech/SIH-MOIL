import React, { useState, useEffect } from 'react';
import { Layers, Lock, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';
import { api } from '../services/api';

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
    <div className="min-h-screen bg-[#0F1214] text-[#E8E6E3] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tech-teal/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn text-black">
        {/* Header Badges */}
        <div className="flex items-center justify-between text-[11px] border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span className="font-mono font-bold text-black">MOIL LIMITED • MINIRATNA</span>
          </div>
          <span className="px-2 py-0.5 rounded-full font-mono bg-white text-black border border-slate-300 text-[10px] font-bold">
            Account Clearance
          </span>
        </div>

        {/* Brand Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-700 flex items-center justify-center text-white shadow-sm">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Activate Official Account
          </h1>
          <p className="text-xs text-black max-w-sm mx-auto font-medium">
            {email ? `Configure access security for ${email}` : 'Set your permanent password to complete account activation'}
          </p>
        </div>

        {success ? (
          <div className="space-y-5 text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-800">
              <CheckCircle2 className="w-9 h-9 text-emerald-700" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-black">Account Successfully Activated!</h3>
              <p className="text-xs text-black leading-relaxed max-w-xs mx-auto font-medium">
                Your credentials and security password have been registered in the MOIL National Mineral Registry.
              </p>
            </div>
            <button
              onClick={onGoToLogin}
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-white">Proceed to Official Sign In</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <>
            {/* Info notice */}
            <div className="p-3 rounded-2xl bg-white border border-slate-300 text-xs text-black flex items-start gap-2.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-black block font-bold">Administrator Approval Verified</strong>
                Your application has been cleared. Create your private password below to activate your account.
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-center gap-2 animate-fadeIn font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {!token && (
                <div className="space-y-1">
                  <label className="text-black font-bold block text-[11px]">Activation Security Token</label>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter token from activation email"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black font-mono text-xs focus:outline-none focus:border-teal-600 font-semibold"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-black font-bold block text-[11px]">New Security Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-teal-600 font-semibold"
                  />
                  <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-black transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-black font-bold block text-[11px]">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type password"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-teal-600 font-semibold"
                  />
                  <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
              >
                <span className="text-white">{loading ? 'Activating Credentials...' : 'Activate Account & Set Password'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-200">
              <button
                onClick={onGoToLogin}
                className="text-xs text-black hover:text-teal-800 transition cursor-pointer font-medium"
              >
                Already activated? <span className="text-teal-800 font-bold underline">Sign in to ReserveIQ</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
