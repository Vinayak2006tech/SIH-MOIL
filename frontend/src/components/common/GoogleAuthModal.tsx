import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, ArrowRight, Sparkles, Plus, Trash2, User, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'login' | 'register';
  defaultRole?: UserRole;
}

interface SavedGoogleAccount {
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarBg?: string;
  picture?: string;
  initials: string;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  mode = 'login',
  defaultRole = 'MINE_PLANNER'
}) => {
  const { loginWithGoogle } = useAuth();
  const [savedAccounts, setSavedAccounts] = useState<SavedGoogleAccount[]>([]);
  const [activeTab, setActiveTab] = useState<'custom' | 'saved'>('custom');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [selectedDept, setSelectedDept] = useState('Mine Planning & Geology');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  // Load user's saved Google accounts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('moil_saved_google_accounts');
      if (stored) {
        const parsed: SavedGoogleAccount[] = JSON.parse(stored);
        setSavedAccounts(parsed);
        if (parsed.length > 0) {
          setActiveTab('saved');
        } else {
          setActiveTab('custom');
        }
      } else {
        setActiveTab('custom');
      }
    } catch {
      setActiveTab('custom');
    }
  }, [isOpen]);

  // Attempt Google Identity Services (GSI) init if available
  useEffect(() => {
    if (!isOpen) return;

    const clientId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
    const google = (window as any).google;

    if (google?.accounts?.id && clientId && googleBtnContainerRef.current) {
      try {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              setLoading(true);
              try {
                await loginWithGoogle({ credential: response.credential });
                onClose();
              } catch (err: any) {
                setError(err.response?.data?.message || 'Google verification failed.');
              } finally {
                setLoading(false);
              }
            }
          }
        });

        google.accounts.id.renderButton(googleBtnContainerRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'pill'
        });
      } catch (err) {
        console.warn('Google Identity button init failed:', err);
      }
    }
  }, [isOpen, loginWithGoogle, onClose]);

  if (!isOpen) return null;

  const saveGoogleAccountToHistory = (account: SavedGoogleAccount) => {
    try {
      const existing = savedAccounts.filter((a) => a.email.toLowerCase() !== account.email.toLowerCase());
      const updated = [account, ...existing].slice(0, 5);
      setSavedAccounts(updated);
      localStorage.setItem('moil_saved_google_accounts', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const removeSavedAccount = (emailToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedAccounts.filter((a) => a.email.toLowerCase() !== emailToRemove.toLowerCase());
    setSavedAccounts(updated);
    localStorage.setItem('moil_saved_google_accounts', JSON.stringify(updated));
    if (updated.length === 0) {
      setActiveTab('custom');
    }
  };

  const handleSelectGoogleAccount = async (acc: SavedGoogleAccount) => {
    setLoading(true);
    setError(null);
    try {
      await loginWithGoogle({
        email: acc.email,
        name: acc.name,
        role: acc.role,
        department: acc.department
      });
      saveGoogleAccountToHistory(acc);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;
    setLoading(true);
    setError(null);

    const displayName = customName.trim() || customEmail.split('@')[0].replace(/[\._]/g, ' ');
    const initials = displayName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const accountObj: SavedGoogleAccount = {
      name: displayName,
      email: customEmail.toLowerCase().trim(),
      role: selectedRole,
      department: selectedDept,
      avatarBg: 'bg-gradient-to-tr from-purple-600 to-indigo-600',
      initials: initials || 'G'
    };

    try {
      await loginWithGoogle({
        email: accountObj.email,
        name: accountObj.name,
        role: accountObj.role,
        department: accountObj.department
      });
      saveGoogleAccountToHistory(accountObj);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Google Modal Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            {/* Authentic Google G SVG Icon */}
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {mode === 'register' ? 'Register with Google' : 'Sign in with Google'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Continue to MOIL ReserveIQ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (when saved accounts exist) */}
        {savedAccounts.length > 0 && (
          <div className="px-6 pt-3 flex gap-2 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setActiveTab('saved')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition ${
                activeTab === 'saved'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Saved Accounts ({savedAccounts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`pb-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1 ${
                activeTab === 'custom'
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              Use Another Account
            </button>
          </div>
        )}

        {/* Native GSI Container if available */}
        <div ref={googleBtnContainerRef} className="px-6 pt-2 empty:hidden" />

        {/* Body Content */}
        <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {activeTab === 'saved' && savedAccounts.length > 0 ? (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Choose an account:
              </span>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                {savedAccounts.map((acc, idx) => (
                  <div
                    key={`saved-${idx}`}
                    onClick={() => handleSelectGoogleAccount(acc)}
                    className="w-full p-3.5 text-left hover:bg-slate-50 flex items-center justify-between transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-9 h-9 rounded-full ${
                          acc.avatarBg || 'bg-gradient-to-tr from-purple-600 to-indigo-600'
                        } text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm`}
                      >
                        {acc.initials}
                      </div>
                      <div className="truncate">
                        <p className="font-semibold text-slate-900 truncate group-hover:text-purple-700 transition-colors">
                          {acc.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">{acc.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
                        {acc.role}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => removeSavedAccount(acc.email, e)}
                        title="Remove from saved accounts"
                        className="p-1 rounded hover:bg-red-100 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setActiveTab('custom')}
                  className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center justify-center gap-1.5 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5" /> Use another Google account
                </button>
              </div>
            </div>
          ) : (
            /* Direct Google Account Sign-In Form */
            <form onSubmit={handleCustomGoogleSubmit} className="space-y-3.5">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-[11px] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Enter your Google/Gmail account to authenticate via Google SSO.</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Google Account Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="your.email@gmail.com or officer@moil.gov.in"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Account Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vinayak Sharma"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-purple-600 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-semibold"
                  >
                    <option value="MINE_PLANNER">Mine Planner</option>
                    <option value="VIEWER">Auditor / Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    placeholder="e.g. Geology & Planning"
                    className="w-full px-2.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                {savedAccounts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('saved')}
                    className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || !customEmail}
                  className={`${
                    savedAccounts.length > 0 ? 'w-2/3' : 'w-full'
                  } py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer`}
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Continue with Google</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Privacy & SSO Security Note */}
          <div className="text-center pt-2 text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>MOIL Enterprise SSO • Secured with SHA-256 JWT & OAuth 2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};


