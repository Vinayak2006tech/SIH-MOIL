import React, { useState } from 'react';
import {
  Layers,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  Building2,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

interface RegisterPageProps {
  onGoToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onGoToLogin }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('MINE_PLANNER');
  const [department, setDepartment] = useState('Mine Planning & Geology');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        department: department.trim(),
        purpose: purpose.trim()
      });

      if (res?.status === 'PENDING' || res?.success) {
        setSubmitted(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please verify the entered details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1214] text-[#E8E6E3] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-manganese-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tech-teal/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg glass-panel bg-[#161D22]/95 border border-[#26333B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn">
        {/* Top Badges */}
        <div className="flex items-center justify-between text-[11px] border-b border-[#26333B] pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tech-teal animate-pulse" />
            <span className="font-mono font-semibold text-slate-300">MOIL LIMITED • MINIRATNA CPSE</span>
          </div>
          <span className="px-2 py-0.5 rounded-full font-mono bg-manganese-950/80 text-manganese-200 border border-manganese-800 text-[10px]">
            National Mineral Registry
          </span>
        </div>

        {submitted ? (
          /* Confirmation Screen after Registration */
          <div className="space-y-6 text-center py-4 animate-fadeIn">
            <div className="w-20 h-20 bg-amber-500/15 border-2 border-amber-500/40 rounded-3xl flex items-center justify-center mx-auto text-amber-400 shadow-glow-amber">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Registration Request Submitted
              </h2>
              <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                Status: Pending Administrator Approval
              </p>
              <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm mx-auto pt-2">
                Your request has been submitted to the MOIL ReserveIQ administrator. Please wait for official approval.
              </p>
            </div>

            {/* Steps explanation */}
            <div className="bg-[#0F1214] border border-[#26333B] rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <strong className="text-slate-200 block font-semibold">Verification by Directorate</strong>
                  <span className="text-[#94A3B8] text-[11px]">System administrators review your departmental clearance and assigned mine division.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-tech-teal/20 text-tech-teal flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <strong className="text-slate-200 block font-semibold">Activation Email Dispatched</strong>
                  <span className="text-[#94A3B8] text-[11px]">
                    Once approved, an email with a secure single-use activation link will be sent to <span className="text-tech-teal font-mono">{email}</span>.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-manganese-500/20 text-manganese-300 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <strong className="text-slate-200 block font-semibold">Instant Platform Access</strong>
                  <span className="text-[#94A3B8] text-[11px]">Click the link to activate your access and view reserves, boreholes, and AI shortfall simulations.</span>
                </div>
              </div>
            </div>

            <button
              onClick={onGoToLogin}
              className="w-full py-3 bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-[#0F1214] font-extrabold rounded-xl shadow-glow-teal transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Return to Official Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={onGoToLogin}
              className="text-xs text-[#94A3B8] hover:text-[#E8E6E3] flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>

            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-manganese-700 via-tech-teal/80 to-tech-teal border border-tech-teal/30 flex items-center justify-center text-[#0F1214] shadow-glow-teal">
                <Layers className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Personnel Registration
              </h1>
              <p className="text-xs text-[#94A3B8]">
                Submit your official details for MOIL ReserveIQ clearance
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-manganese-950/40 border border-manganese-800/80 text-xs text-manganese-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-tech-teal shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-white block font-semibold">Admin Approval Required</strong>
                Submitted accounts require administrator authorization before full access to the mineral registry is granted.
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajeshwar Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] focus:outline-none focus:border-tech-teal text-xs"
                  />
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Official Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@moil.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] font-mono focus:outline-none focus:border-tech-teal text-xs"
                  />
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block text-[11px]">Requested Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] focus:outline-none focus:border-tech-teal text-xs cursor-pointer"
                  >
                    <option value="MINE_PLANNER">Mine Planner</option>
                    <option value="VIEWER">Ministry Auditor (Viewer)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block text-[11px]">Department / Unit</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Balaghat Planning"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] focus:outline-none focus:border-tech-teal text-xs"
                    />
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Preferred Security Password</label>
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
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Access Justification / Notes (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Q3 Balaghat Seam Estimation"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] focus:outline-none focus:border-tech-teal text-xs"
                  />
                  <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-[#0F1214] font-extrabold rounded-xl shadow-glow-teal transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Submitting Request...' : 'Submit Registration Request'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-[#26333B]">
              <button
                onClick={onGoToLogin}
                className="text-xs text-tech-teal hover:text-tech-cyan font-semibold cursor-pointer"
              >
                Already registered? <strong>Sign in to existing account</strong>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
