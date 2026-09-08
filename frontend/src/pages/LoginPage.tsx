import React, { useState } from 'react';
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Clock,
  Ban,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthModal } from '../components/common/GoogleAuthModal';
import type { UserRole } from '../types';

interface LoginPageProps {
  onGoToRegister: () => void;
  onGoToForgotPassword?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister, onGoToForgotPassword }) => {
  const { login, demoLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<'PENDING' | 'REJECTED' | 'SUSPENDED' | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorStatus(null);
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      const respStatus = err.response?.data?.status;
      const respMsg = err.response?.data?.message;

      if (respStatus === 'PENDING') {
        setErrorStatus('PENDING');
        setError(respMsg || 'Your registration request has been submitted. Please wait for administrator approval.');
      } else if (respStatus === 'REJECTED') {
        setErrorStatus('REJECTED');
        setError(respMsg || 'Your account registration was not approved by the administrator.');
      } else if (respStatus === 'SUSPENDED') {
        setErrorStatus('SUSPENDED');
        setError(respMsg || 'Your account has been suspended by the administrator.');
      } else {
        setError(respMsg || 'Invalid email or password. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role: UserRole) => {
    setError(null);
    setErrorStatus(null);
    setLoading(true);
    try {
      await demoLogin(role);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Demo authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-950/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-xl glass-panel bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 animate-fadeIn my-auto">
        {/* Top Ministry & GOI Badges */}
        <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-semibold text-slate-300">MOIL LIMITED • MINIRATNA CPSE</span>
          </div>
          <span className="px-2 py-0.5 rounded-full font-mono bg-purple-950/80 text-purple-300 border border-purple-800 text-[10px]">
            Ministry of Steel • Govt. of India
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-800 flex items-center justify-center text-white shadow-glow-purple">
            <Layers className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            MOIL <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">ReserveIQ</span>
          </h1>
          <p className="text-xs text-slate-300 max-w-sm mx-auto font-medium leading-relaxed">
            AI-Driven Manganese Ore Reserve Estimation & Production Shortfall Mitigation System
          </p>
        </div>


        {/* Custom Status Error Alerts */}
        {error && (
          <div>
            {errorStatus === 'PENDING' ? (
              <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-800/70 text-amber-200 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-300">
                  <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>REGISTRATION PENDING APPROVAL</span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed">{error}</p>
                <div className="text-[11px] text-amber-300/80 border-t border-amber-800/50 pt-1.5">
                  An activation email will be sent automatically once your department supervisor clears your account.
                </div>
              </div>
            ) : errorStatus === 'REJECTED' ? (
              <div className="p-4 rounded-2xl bg-red-950/50 border border-red-800/70 text-red-200 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs text-red-300">
                  <Ban className="w-4 h-4 text-red-400" />
                  <span>REGISTRATION NOT APPROVED</span>
                </div>
                <p className="text-xs text-red-100/90 leading-relaxed">{error}</p>
                <div className="text-[11px] text-red-300/80 border-t border-red-800/50 pt-1.5">
                  For clearance inquiries, contact the Directorate of Mine Planning & Exploration.
                </div>
              </div>
            ) : errorStatus === 'SUSPENDED' ? (
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-200 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-400">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>ACCOUNT SUSPENDED</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{error}</p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold text-[11px] block">Official Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@moil.gov.in"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 font-mono text-xs"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold text-[11px] block">Security Password</label>
              {onGoToForgotPassword && (
                <button
                  type="button"
                  onClick={onGoToForgotPassword}
                  className="text-[11px] text-purple-400 hover:text-purple-300 font-medium transition cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition focus:outline-none cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-glow-purple transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Authenticating Personnel...' : 'Sign In to ReserveIQ'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Divider & Google Login / Demo Access */}
        <div className="space-y-3 pt-1 border-t border-slate-800/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ADMIN')}
              className="py-2.5 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-800/80 text-purple-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>1-Click Admin Access</span>
            </button>
          </div>

          {/* Registration Link */}
          <div className="text-center pt-1">
            <button
              onClick={onGoToRegister}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold transition"
            >
              Don't have an account? <span className="underline font-bold">Register Official Personnel Account</span>
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Encrypted
          </span>
          <span>National Mineral Registry</span>
        </div>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        mode="login"
        defaultRole="ADMIN"
      />
    </div>
  );
};
