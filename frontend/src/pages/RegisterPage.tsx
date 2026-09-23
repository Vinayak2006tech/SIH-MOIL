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
import { ThemeToggle } from '../components/common/ThemeToggle';
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
      {/* Top right Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-manganese-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-tech-teal/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fadeIn text-black">
        {/* Top Badges */}
        <div className="flex items-center justify-between text-[11px] border-b border-slate-200 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
            <span className="font-mono font-bold text-black">MOIL LIMITED • MINIRATNA CPSE</span>
          </div>
          <span className="px-2 py-0.5 rounded-full font-mono bg-white text-black border border-slate-300 text-[10px] font-bold">
            National Mineral Registry
          </span>
        </div>

        {submitted ? (
          /* Confirmation Screen after Registration */
          <div className="space-y-6 text-center py-4 animate-fadeIn">
            <div className="w-20 h-20 bg-amber-50 border-2 border-amber-400 rounded-3xl flex items-center justify-center mx-auto text-amber-700 shadow-sm">
              <Clock className="w-10 h-10 animate-pulse text-amber-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-black tracking-tight">
                Registration Request Submitted
              </h2>
              <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">
                Status: Pending Administrator Approval
              </p>
              <p className="text-xs text-black leading-relaxed max-w-sm mx-auto pt-2 font-medium">
                Your request has been submitted to the MOIL ReserveIQ administrator. Please wait for official approval.
              </p>
            </div>

            {/* Steps explanation */}
            <div className="bg-white border border-slate-300 rounded-2xl p-4 text-left space-y-3 shadow-sm">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5 border border-emerald-300">
                  1
                </div>
                <div>
                  <strong className="text-black block font-bold">Verification by Directorate</strong>
                  <span className="text-black text-[11px]">System administrators review your departmental clearance and assigned mine division.</span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5 border border-teal-300">
                  2
                </div>
                <div>
                  <strong className="text-black block font-bold">Activation Email Dispatched</strong>
                  <span className="text-black text-[11px]">
                    Once approved, an email with a secure single-use activation link will be sent to <span className="text-teal-800 font-mono font-bold">{email}</span>.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5 border border-purple-300">
                  3
                </div>
                <div>
                  <strong className="text-black block font-bold">Instant Platform Access</strong>
                  <span className="text-black text-[11px]">Click the link to activate your access and view reserves, boreholes, and AI shortfall simulations.</span>
                </div>
              </div>
            </div>

            <button
              onClick={onGoToLogin}
              className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-white">Return to Official Sign In</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={onGoToLogin}
              className="text-xs text-black hover:text-teal-800 flex items-center gap-1.5 transition cursor-pointer font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-black" /> Back to Sign In
            </button>

            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-teal-700 border border-teal-600 flex items-center justify-center text-white shadow-sm">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-black text-black tracking-tight">
                Personnel Registration
              </h1>
              <p className="text-xs text-black font-medium">
                Submit your official details for MOIL ReserveIQ clearance
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-slate-300 text-xs text-black flex items-start gap-2.5 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong className="text-black block font-bold">Admin Approval Required</strong>
                Submitted accounts require administrator authorization before full access to the mineral registry is granted.
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-center gap-2 animate-fadeIn font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-black font-bold block text-[11px]">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Rajeshwar Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black focus:outline-none focus:border-teal-600 text-xs font-semibold"
                  />
                  <UserIcon className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-black font-bold block text-[11px]">Official Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@moil.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black font-mono focus:outline-none focus:border-teal-600 text-xs font-semibold"
                  />
                  <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-black font-bold block text-[11px]">Requested Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black font-bold focus:outline-none focus:border-teal-600 text-xs cursor-pointer"
                  >
                    <option value="MINE_PLANNER" className="bg-white text-black font-bold">Mine Planner</option>
                    <option value="VIEWER" className="bg-white text-black font-bold">Ministry Auditor (Viewer)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-black font-bold block text-[11px]">Department / Unit</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Balaghat Planning"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black focus:outline-none focus:border-teal-600 text-xs font-semibold"
                    />
                    <Building2 className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-black font-bold block text-[11px]">Preferred Security Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-black focus:outline-none focus:border-teal-600 text-xs font-semibold"
                  />
                  <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-black transition focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-black font-bold block text-[11px]">Access Justification / Notes (Optional)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g. Q3 Balaghat Seam Estimation"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black focus:outline-none focus:border-teal-600 text-xs font-semibold"
                  />
                  <FileText className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer"
              >
                <span className="text-white">{loading ? 'Submitting Request...' : 'Submit Registration Request'}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-200">
              <button
                onClick={onGoToLogin}
                className="text-xs text-black hover:text-teal-800 font-medium cursor-pointer"
              >
                Already registered? <strong className="text-teal-800 font-bold underline">Sign in to existing account</strong>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
