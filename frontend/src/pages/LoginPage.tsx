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
import { ThemeToggle } from '../components/common/ThemeToggle';

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
      const respMsg = err.response?.data?.message || err.response?.data?.detail || err.response?.data?.error;

      if (respStatus === 'PENDING') {
        setErrorStatus('PENDING');
        setError(respMsg || 'Your registration request has been submitted. Please wait for administrator approval.');
      } else if (respStatus === 'REJECTED') {
        setErrorStatus('REJECTED');
        setError(respMsg || 'Your account registration was not approved by the administrator.');
      } else if (respStatus === 'SUSPENDED') {
        setErrorStatus('SUSPENDED');
        setError(respMsg || 'Your account has been suspended by the administrator.');
      } else if (err.response?.status === 401) {
        setError(respMsg || 'Invalid email or password. Please verify your credentials.');
      } else {
        setError(respMsg || (err.response?.status ? `Authentication server returned error (${err.response.status}). Please try again.` : (err.message || 'Invalid email or password. Please verify your credentials.')));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1214] text-[#E8E6E3] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden bg-grid-cyber">
      {/* Top right Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-manganese-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tech-teal/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tech-cyan/5 rounded-full blur-3xl pointer-events-none animate-float-reverse" />

      <div className="relative w-full max-w-xl bg-white border border-slate-300 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 animate-fadeIn my-auto text-black">
        {/* Top Ministry & GOI Badges */}
        <div className="flex items-center justify-between text-[11px] border-b border-slate-200 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
            <span className="font-mono font-bold text-black">MOIL LIMITED • MINIRATNA CPSE</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full font-mono bg-white text-black border border-slate-300 text-[10px] font-bold shadow-sm">
            Ministry of Steel • Govt. of India
          </span>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-teal-700 border border-teal-600 flex items-center justify-center text-white shadow-md animate-float">
            <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight">
            <span className="text-black font-black">MOIL</span> <span className="text-teal-700 font-black">ReserveIQ</span>
          </h1>
          <p className="text-xs text-black max-w-sm mx-auto font-medium leading-relaxed">
            AI-Driven Manganese Ore Reserve Estimation & Production Shortfall Mitigation System
          </p>
        </div>

        {/* Custom Status Error Alerts */}
        {error && (
          <div>
            {errorStatus === 'PENDING' ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-black space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                  <Clock className="w-4 h-4 text-amber-700 animate-pulse" />
                  <span>REGISTRATION PENDING APPROVAL</span>
                </div>
                <p className="text-xs text-black leading-relaxed">{error}</p>
                <div className="text-[11px] text-black border-t border-amber-200 pt-1.5 font-medium">
                  An activation email will be sent automatically once your department supervisor clears your account.
                </div>
              </div>
            ) : errorStatus === 'REJECTED' ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-black space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                  <Ban className="w-4 h-4 text-rose-700" />
                  <span>REGISTRATION NOT APPROVED</span>
                </div>
                <p className="text-xs text-black leading-relaxed">{error}</p>
                <div className="text-[11px] text-black border-t border-rose-200 pt-1.5 font-medium">
                  For clearance inquiries, contact the Directorate of Mine Planning & Exploration.
                </div>
              </div>
            ) : errorStatus === 'SUSPENDED' ? (
              <div className="p-4 rounded-2xl bg-white border border-slate-300 text-black space-y-2 animate-fadeIn">
                <div className="flex items-center gap-2 font-bold text-xs text-rose-700">
                  <ShieldAlert className="w-4 h-4 text-rose-700" />
                  <span>ACCOUNT SUSPENDED</span>
                </div>
                <p className="text-xs text-black leading-relaxed">{error}</p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Standard Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="text-black font-bold text-[11px] block">Official Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@moil.gov.in"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black focus:outline-none focus:border-teal-600 font-mono text-xs"
              />
              <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-black font-bold text-[11px] block">Security Password</label>
              {onGoToForgotPassword && (
                <button
                  type="button"
                  onClick={onGoToForgotPassword}
                  className="text-[11px] text-teal-800 hover:underline font-bold transition cursor-pointer"
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
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-black focus:outline-none focus:border-teal-600 text-xs"
              />
              <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-black transition focus:outline-none cursor-pointer"
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
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span className="text-white">{loading ? 'Authenticating Personnel...' : 'Sign In to ReserveIQ'}</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </form>

        {/* Registration Link */}
        <div className="pt-2 border-t border-slate-200 text-center">
          <button
            type="button"
            onClick={onGoToRegister}
            className="text-xs text-black hover:text-teal-800 font-medium transition cursor-pointer"
          >
            Don't have an account? <span className="underline font-bold text-teal-800">Register Official Personnel Account</span>
          </button>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-between text-[10px] text-black font-mono pt-1 border-t border-slate-200">
          <span className="flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 256-Bit SSL Encrypted
          </span>
          <span className="font-bold">National Mineral Registry</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
