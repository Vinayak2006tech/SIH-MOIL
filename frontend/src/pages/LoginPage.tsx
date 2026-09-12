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
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginPageProps {
  onGoToRegister: () => void;
  onGoToForgotPassword?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister, onGoToForgotPassword }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<'PENDING' | 'REJECTED' | 'SUSPENDED' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorStatus(null);
    setLoading(true);

    try {
      await login(email.trim(), password.trim());
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
        setError(respMsg || err.message || 'Invalid email or password. Please verify your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1214] text-[#E8E6E3] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden bg-grid-cyber">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-manganese-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tech-teal/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tech-cyan/5 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

      <div className="relative w-full max-w-xl glass-panel bg-[#161D22]/95 border border-[#26333B] rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 animate-fadeIn my-auto">
        {/* Top Ministry & GOI Badges */}
        <div className="flex items-center justify-between text-[11px] border-b border-[#26333B] pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tech-teal animate-ping" />
            <span className="font-mono font-semibold text-slate-300">MOIL LIMITED • MINIRATNA CPSE</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full font-mono bg-manganese-950/80 text-manganese-200 border border-manganese-800 text-[10px] shadow-sm">
            Ministry of Steel • Govt. of India
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-manganese-700 via-tech-teal/80 to-tech-teal border border-tech-teal/30 flex items-center justify-center text-[#0F1214] shadow-glow-teal animate-float">
            <Layers className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#E8E6E3] tracking-tight">
            MOIL <span className="text-transparent bg-clip-text bg-gradient-to-r from-manganese-300 via-tech-teal to-tech-cyan animate-gradient-flow">ReserveIQ</span>
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto font-medium leading-relaxed">
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
              <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/70 text-rose-200 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-300">
                  <Ban className="w-4 h-4 text-rose-400" />
                  <span>REGISTRATION NOT APPROVED</span>
                </div>
                <p className="text-xs text-rose-100/90 leading-relaxed">{error}</p>
                <div className="text-[11px] text-rose-300/80 border-t border-rose-800/50 pt-1.5">
                  For clearance inquiries, contact the Directorate of Mine Planning & Exploration.
                </div>
              </div>
            ) : errorStatus === 'SUSPENDED' ? (
              <div className="p-4 rounded-2xl bg-[#0F1214] border border-[#26333B] text-slate-200 space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-400">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>ACCOUNT SUSPENDED</span>
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{error}</p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
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
                className="w-full pl-9 pr-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] focus:outline-none focus:border-tech-teal font-mono text-xs"
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
                  className="text-[11px] text-tech-teal hover:text-tech-cyan font-medium transition cursor-pointer"
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
                className="w-full pl-9 pr-10 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] focus:outline-none focus:border-tech-teal text-xs"
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
            className="btn-shimmer w-full py-3 bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-[#0F1214] font-extrabold rounded-xl shadow-glow-teal transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>{loading ? 'Authenticating Personnel...' : 'Sign In to ReserveIQ'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Registration Link */}
        <div className="pt-2 border-t border-[#26333B] text-center">
          <button
            type="button"
            onClick={onGoToRegister}
            className="text-xs text-tech-teal hover:text-tech-cyan font-semibold transition cursor-pointer"
          >
            Don't have an account? <span className="underline font-bold">Register Official Personnel Account</span>
          </button>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-[#26333B]/60">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 256-Bit SSL Encrypted
          </span>
          <span>National Mineral Registry</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
