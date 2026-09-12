import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { api } from '../services/api';

interface ForgotPasswordPageProps {
  onGoToLogin: () => void;
  onGoToReset?: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onGoToLogin, onGoToReset }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to dispatch reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1214] text-[#E8E6E3] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Glow */}
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
            Reset Password
          </h1>
          <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
            Enter your registered official email address to receive a secure password recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-5 text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 bg-tech-teal/20 border border-tech-teal/40 rounded-full flex items-center justify-center mx-auto text-tech-teal">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#E8E6E3]">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                If an approved account exists for <strong className="text-white">{email}</strong>, a password reset link has been generated and dispatched.
              </p>
              <p className="text-[11px] text-[#94A3B8]">
                (In development mode without SMTP, check your backend server terminal logs for the direct reset link).
              </p>
            </div>

            {onGoToReset && (
              <button
                onClick={onGoToReset}
                className="w-full py-2.5 bg-[#0F1214] hover:bg-[#1B2226] text-[#E8E6E3] text-xs font-semibold rounded-xl border border-[#26333B] transition cursor-pointer"
              >
                Enter Reset Token Manually
              </button>
            )}

            <button
              onClick={onGoToLogin}
              className="w-full py-3 bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-[#0F1214] font-extrabold rounded-xl shadow-glow-teal transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Return to Sign In</span>
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

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Official Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@moil.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] font-mono text-xs focus:outline-none focus:border-tech-teal"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-[#0F1214] font-extrabold rounded-xl shadow-glow-teal transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Dispatching Reset Link...' : 'Send Password Reset Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
