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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle Glow */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 animate-fadeIn">
        <button
          onClick={onGoToLogin}
          className="text-xs text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </button>

        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-manganese-700 via-teal-700 to-teal-600 border border-teal-500/30 flex items-center justify-center text-white shadow-sm">
            <KeyRound className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
            Reset Password
          </h1>
          <p className="text-xs text-slate-600 font-medium max-w-sm mx-auto">
            Enter your registered official email address to receive a secure password recovery link.
          </p>
        </div>

        {submitted ? (
          <div className="space-y-5 text-center py-4 animate-fadeIn">
            <div className="w-16 h-16 bg-teal-50 border border-teal-200 rounded-full flex items-center justify-center mx-auto text-teal-700">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                If an approved account exists for <strong className="text-slate-900 font-bold">{email}</strong>, a password reset link has been generated and dispatched.
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                (In development mode without SMTP, check your backend server terminal logs for the direct reset link).
              </p>
            </div>

            {onGoToReset && (
              <button
                onClick={onGoToReset}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-300 transition cursor-pointer"
              >
                Enter Reset Token Manually
              </button>
            )}

            <button
              onClick={onGoToLogin}
              className="w-full py-3 bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-white font-extrabold rounded-xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Return to Sign In</span>
              <ArrowRight className="w-4 h-4 text-white" />
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
                <label className="text-slate-700 font-bold block text-[11px]">Official Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@moil.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono text-xs focus:outline-none focus:border-teal-600"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-white font-extrabold rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Dispatching Reset Link...' : 'Send Password Reset Link'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
