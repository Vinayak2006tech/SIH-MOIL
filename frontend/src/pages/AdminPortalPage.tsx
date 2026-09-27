import React, { useState, useEffect } from 'react';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MoreVertical,
  Shield,
  Trash2,
  Key,
  Building,
  Mail,
  Calendar,
  RotateCcw,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Edit3,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  UserCog,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import type { User, UserRole, UserStatus, UserStats } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminPortalPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    rejectedUsers: 0,
    suspendedUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'SUSPENDED' | 'REJECTED'>('ALL');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Modals state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<'APPROVE' | 'REJECT' | 'SUSPEND' | 'EDIT_ROLE' | 'DELETE' | 'CREATE_USER' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('MINE_PLANNER');
  const [editDepartment, setEditDepartment] = useState('');

  // Create User state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [newUserRole, setNewUserRole] = useState<UserRole>('ADMIN');
  const [newUserDepartment, setNewUserDepartment] = useState('Central Administration Directorate');
  const [newUserStatus, setNewUserStatus] = useState<'APPROVED' | 'PENDING'>('APPROVED');
  const [changingRoleId, setChangingRoleId] = useState<string | null>(null);

  const fetchUsersAndStats = async () => {
    setLoading(true);
    try {
      const [usersData, statsData] = await Promise.all([
        api.getAdminUsers({
          status: activeTab !== 'ALL' ? activeTab : undefined,
          role: roleFilter !== 'ALL' ? roleFilter : undefined,
          search: searchTerm ? searchTerm : undefined
        }),
        api.getAdminUserStats()
      ]);
      setUsers(usersData?.users || []);
      if (statsData) {
        setStats(statsData);
      }
    } catch (err: any) {
      console.error('Failed to fetch admin users:', err);
      showToast('error', err.response?.data?.message || 'Failed to load user records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAndStats();
  }, [activeTab, roleFilter, searchTerm]);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 5000);
  };

  const handleOpenApproveModal = (u: User) => {
    setSelectedUser(u);
    setEditRole(u.role);
    setEditDepartment(u.department || 'Mine Planning & Geology');
    setModalType('APPROVE');
  };

  const handleOpenRejectModal = (u: User) => {
    setSelectedUser(u);
    setActionReason('');
    setModalType('REJECT');
  };

  const handleOpenSuspendModal = (u: User) => {
    setSelectedUser(u);
    setActionReason('');
    setModalType('SUSPEND');
  };

  const handleOpenEditRoleModal = (u: User) => {
    const uId = u._id || u.id || '';
    const isCurrent = uId === currentUser?.id || u.email.toLowerCase() === currentUser?.email?.toLowerCase();
    if (isCurrent) {
      showToast('error', 'Security safeguard: Administrators cannot change their own assigned role.');
      return;
    }
    setSelectedUser(u);
    setEditRole(u.role);
    setEditDepartment(u.department || '');
    setModalType('EDIT_ROLE');
  };

  const handleQuickRoleChange = async (u: User, newRole: UserRole) => {
    const uId = u._id || u.id || '';
    if (!uId || u.role === newRole) return;

    const isCurrent = uId === currentUser?.id || u.email.toLowerCase() === currentUser?.email?.toLowerCase();
    if (isCurrent) {
      showToast('error', 'Security safeguard: Administrators cannot change their own assigned role.');
      return;
    }

    setChangingRoleId(uId);
    try {
      const res = await api.updateUserRole(uId, { role: newRole });
      showToast('success', res.message || `Assigned role for ${u.name} updated to ${newRole}.`);
      setUsers((prev) =>
        prev.map((item) => {
          const itemId = item._id || item.id || '';
          if (itemId === uId) {
            return { ...item, role: newRole };
          }
          return item;
        })
      );
      fetchUsersAndStats();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || `Failed to update role for ${u.name}.`);
    } finally {
      setChangingRoleId(null);
    }
  };

  const handleOpenDeleteModal = (u: User) => {
    setSelectedUser(u);
    setModalType('DELETE');
  };

  const handleOpenCreateUserModal = () => {
    setSelectedUser(null);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPassword('');
    setShowNewUserPassword(false);
    setNewUserRole('ADMIN');
    setNewUserDepartment('Central Administration Directorate');
    setNewUserStatus('APPROVED');
    setModalType('CREATE_USER');
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
    setActionReason('');
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword.trim()) {
      showToast('error', 'Please fill in all required fields (Name, Email, Password).');
      return;
    }
    if (newUserPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await api.createAdminUser({
        name: newUserName.trim(),
        email: newUserEmail.trim().toLowerCase(),
        password: newUserPassword.trim(),
        role: newUserRole,
        department: newUserDepartment.trim(),
        status: newUserStatus,
        mineAccess: ['ALL']
      });
      showToast('success', res.message || `Account for ${newUserName} created successfully! They can log in immediately.`);
      closeModal();
      fetchUsersAndStats();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Failed to create user account.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const id = selectedUser._id || selectedUser.id || '';
      const res = await api.approveUser(id, {
        role: editRole,
        department: editDepartment
      });
      showToast('success', res.message || `Account for ${selectedUser.name} approved! Activation link sent.`);
      closeModal();
      fetchUsersAndStats();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Approval action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const id = selectedUser._id || selectedUser.id || '';
      const res = await api.rejectUser(id, actionReason);
      showToast('info', res.message || `Registration for ${selectedUser.name} has been rejected.`);
      closeModal();
      fetchUsersAndStats();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Rejection action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const id = selectedUser._id || selectedUser.id || '';
      const res = await api.suspendUser(id, actionReason);
      showToast('info', res.message || `Account for ${selectedUser.name} suspended.`);
      closeModal();
      fetchUsersAndStats();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Suspension action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async (u: User) => {
    setActionLoading(true);
    try {
      const id = u._id || u.id || '';
      const res = await api.reactivateUser(id);
      showToast('success', res.message || `Account for ${u.name} reactivated!`);
      fetchUsersAndStats();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Reactivation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const id = selectedUser._id || selectedUser.id || '';
      const res = await api.updateUserRole(id, {
        role: editRole,
        department: editDepartment.trim() || undefined
      });
      showToast('success', res.message || `Permissions and role for ${selectedUser.name} updated.`);
      closeModal();
      fetchUsersAndStats();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Role update failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      const id = selectedUser._id || selectedUser.id || '';
      const res = await api.deleteUser(id);
      showToast('success', res.message || `User account permanently removed.`);
      closeModal();
      fetchUsersAndStats();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Deletion failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 whitespace-nowrap">Administrator</span>;
      case 'MINE_PLANNER':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-300 whitespace-nowrap">Mine Planner</span>;
      case 'VIEWER':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 whitespace-nowrap">Ministry Auditor</span>;
      case 'USER':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-300 whitespace-nowrap">Standard User</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 whitespace-nowrap">{role}</span>;
    }
  };

  const getStatusBadge = (status?: UserStatus) => {
    const st = status || 'APPROVED';
    switch (st) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-xs animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pending Approval
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Approved & Active
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-900 border border-rose-300 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rejected
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Suspended
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn text-black bg-white min-h-screen p-4 sm:p-6 w-full max-w-full min-w-0">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-fadeIn text-xs max-w-md ${toast.type === 'success'
            ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
            : toast.type === 'error'
              ? 'bg-rose-50 border-rose-400 text-rose-900'
              : 'bg-teal-50 border-teal-400 text-teal-900'
            }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-teal-600 shrink-0" />
          )}
          <span className="font-semibold leading-relaxed">{toast.message}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-300 relative overflow-hidden shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300">
                ADMINISTRATION & SECURITY PORTAL
              </span>
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse shrink-0" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-black tracking-tight flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-teal-700 shrink-0" />
              <span className="break-words">Personnel Access & Approval Registry</span>
            </h1>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
              Authorized administrators can review personnel registration requests, grant clearance, assign operational roles, and manage access security.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 flex-wrap">
            <button
              onClick={handleOpenCreateUserModal}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Provision Personnel / Admin</span>
            </button>
            <button
              onClick={fetchUsersAndStats}
              disabled={loading}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('ALL')}
          className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer shadow-sm ${activeTab === 'ALL'
            ? 'border-teal-600 bg-teal-50/60 shadow-md'
            : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
        >
          <div className="flex items-center justify-between text-slate-600 text-xs font-semibold mb-1.5 sm:mb-2 gap-1">
            <span className="truncate">Total Personnel</span>
            <Users className="w-4 h-4 text-teal-700 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-black">{stats.totalUsers}</div>
          <p className="text-[10px] text-slate-500 mt-1 truncate">All registered accounts</p>
        </div>

        <div
          onClick={() => setActiveTab('PENDING')}
          className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer relative shadow-sm ${activeTab === 'PENDING'
            ? 'border-amber-600 bg-amber-50 shadow-md'
            : stats.pendingUsers > 0
              ? 'border-amber-300 bg-amber-50/30'
              : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
        >
          {stats.pendingUsers > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
          )}
          <div className="flex items-center justify-between text-amber-800 text-xs font-semibold mb-1.5 sm:mb-2 gap-1">
            <span className="truncate">Pending Clearance</span>
            <Clock className="w-4 h-4 text-amber-600 animate-pulse shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-800">{stats.pendingUsers}</div>
          <p className="text-[10px] text-amber-700 mt-1 truncate">Awaiting approval</p>
        </div>

        <div
          onClick={() => setActiveTab('APPROVED')}
          className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer shadow-sm ${activeTab === 'APPROVED'
            ? 'border-emerald-600 bg-emerald-50 shadow-md'
            : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
        >
          <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold mb-1.5 sm:mb-2 gap-1">
            <span className="truncate">Approved & Active</span>
            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-800">{stats.approvedUsers}</div>
          <p className="text-[10px] text-emerald-700 mt-1 truncate">Active platform accounts</p>
        </div>

        <div
          onClick={() => setActiveTab('SUSPENDED')}
          className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer shadow-sm ${activeTab === 'SUSPENDED'
            ? 'border-slate-500 bg-slate-100 shadow-md'
            : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
        >
          <div className="flex items-center justify-between text-slate-700 text-xs font-semibold mb-1.5 sm:mb-2 gap-1">
            <span className="truncate">Suspended</span>
            <ShieldAlert className="w-4 h-4 text-slate-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800">{stats.suspendedUsers}</div>
          <p className="text-[10px] text-slate-500 mt-1 truncate">Temporarily locked</p>
        </div>

        <div
          onClick={() => setActiveTab('REJECTED')}
          className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer col-span-2 sm:col-span-1 shadow-sm ${activeTab === 'REJECTED'
            ? 'border-rose-600 bg-rose-50 shadow-md'
            : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
        >
          <div className="flex items-center justify-between text-rose-800 text-xs font-semibold mb-1.5 sm:mb-2 gap-1">
            <span className="truncate">Rejected</span>
            <UserX className="w-4 h-4 text-rose-600 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-800">{stats.rejectedUsers}</div>
          <p className="text-[10px] text-rose-700 mt-1 truncate">Disapproved requests</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-300 space-y-3 sm:space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin max-w-full">
            {(
              [
                { key: 'ALL' as const, label: 'All Users', count: stats.totalUsers, highlight: false },
                { key: 'PENDING' as const, label: 'Pending Approvals', count: stats.pendingUsers, highlight: true },
                { key: 'APPROVED' as const, label: 'Approved', count: stats.approvedUsers, highlight: false },
                { key: 'SUSPENDED' as const, label: 'Suspended', count: stats.suspendedUsers, highlight: false },
                { key: 'REJECTED' as const, label: 'Rejected', count: stats.rejectedUsers, highlight: false }
              ]
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${activeTab === t.key
                  ? t.highlight && t.count > 0
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-teal-700 text-white font-extrabold shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-black border border-slate-300'
                  }`}
              >
                <span>{t.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${activeTab === t.key
                    ? 'bg-black/20 text-current'
                    : 'bg-slate-100 text-slate-700'
                    }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Role Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-60 md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, department..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-black placeholder:text-slate-400 focus:outline-none focus:border-teal-600 font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-black focus:outline-none focus:border-teal-600 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="MINE_PLANNER">Mine Planners</option>
              <option value="ADMIN">Administrators</option>
              <option value="VIEWER">Ministry Auditors</option>
              <option value="USER">Standard Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Registry Table & Cards */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-300 overflow-hidden shadow-sm">
        {/* Desktop / Tablet Table View (>= 768px) */}
        <div className="hidden md:block overflow-x-auto w-full scrollbar-thin">
          <table className="w-full min-w-[880px] text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-300">
              <tr>
                <th className="px-5 py-3.5 font-bold min-w-[220px]">Personnel Details</th>
                <th className="px-4 py-3.5 font-bold whitespace-nowrap min-w-[130px]">Assigned Role</th>
                <th className="px-4 py-3.5 font-bold min-w-[160px]">Department / Division</th>
                <th className="px-4 py-3.5 font-bold whitespace-nowrap min-w-[140px]">Clearance Status</th>
                <th className="px-4 py-3.5 font-bold whitespace-nowrap min-w-[140px]">Timeline & Activity</th>
                <th className="px-5 py-3.5 font-bold text-right whitespace-nowrap min-w-[170px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-700 mb-2" />
                    <span>Loading authorized personnel records...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="font-semibold text-slate-700">No personnel records found.</p>
                    <p className="text-[11px] text-slate-500">Try changing filter tab or search keywords.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const uId = u._id || u.id || '';
                  const isCurrent = uId === currentUser?.id || u.email.toLowerCase() === currentUser?.email?.toLowerCase();
                  const status = u.status || 'APPROVED';

                  return (
                    <tr key={uId} className="hover:bg-slate-50 transition">
                      {/* Name & Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-black flex items-center gap-1.5">
                              <span className="truncate">{u.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-teal-50 text-teal-800 border border-teal-200 shrink-0 font-semibold">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 font-mono flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        {isCurrent ? (
                          <div className="flex items-center gap-1.5">
                            {getRoleBadge(u.role)}
                            <span className="text-[10px] text-slate-400 font-semibold" title="Current administrative session">(You)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <div className="relative inline-flex items-center">
                              <select
                                value={u.role}
                                disabled={changingRoleId === uId || actionLoading}
                                onChange={(e) => handleQuickRoleChange(u, e.target.value as UserRole)}
                                aria-label={`Change assigned role for ${u.name}`}
                                className={`text-[11px] font-bold py-1 pl-2.5 pr-7 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all appearance-none shadow-xs disabled:opacity-60 ${
                                  u.role === 'ADMIN'
                                    ? 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100'
                                    : u.role === 'MINE_PLANNER'
                                    ? 'bg-teal-50 text-teal-900 border-teal-300 hover:bg-teal-100'
                                    : u.role === 'VIEWER'
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                                    : 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                                }`}
                              >
                                <option value="ADMIN">Administrator</option>
                                <option value="MINE_PLANNER">Mine Planner</option>
                                <option value="VIEWER">Ministry Auditor</option>
                                <option value="USER">Standard User</option>
                              </select>
                              {changingRoleId === uId ? (
                                <RefreshCw className="w-3 h-3 text-teal-700 animate-spin absolute right-2 pointer-events-none" />
                              ) : (
                                <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 pointer-events-none" />
                              )}
                            </div>

                            <button
                              onClick={() => handleOpenEditRoleModal(u)}
                              className="p-1 rounded-md text-slate-400 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                              title="Configure Role & Permissions in detail"
                              aria-label={`Configure role for ${u.name}`}
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Department */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{u.department || 'MOIL HQ'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getStatusBadge(status)}
                          {u.rejectionReason && status === 'REJECTED' && (
                            <div className="text-[10px] text-rose-700 italic max-w-xs truncate">
                              Reason: {u.rejectionReason}
                            </div>
                          )}
                          {u.suspensionReason && status === 'SUSPENDED' && (
                            <div className="text-[10px] text-slate-600 italic max-w-xs truncate">
                              Reason: {u.suspensionReason}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-4 text-[11px] text-slate-600 whitespace-nowrap font-mono">
                        <div className="space-y-0.5">
                          {u.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                            </div>
                          )}
                          {u.lastLogin && (
                            <div className="text-[10px] text-slate-500">
                              Active: {new Date(u.lastLogin).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                          {/* Admin can change the assigned role of other users in any status */}
                          {!isCurrent && (
                            <button
                              onClick={() => handleOpenEditRoleModal(u)}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 hover:border-purple-300 font-bold text-[11px] flex items-center gap-1 shadow-xs transition cursor-pointer shrink-0"
                              title="Change Assigned Role & Clearances"
                            >
                              <Shield className="w-3 h-3 text-purple-700" />
                              <span>Change Role</span>
                            </button>
                          )}

                          {status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleOpenApproveModal(u)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition cursor-pointer shrink-0"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(u)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer shrink-0"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {status === 'APPROVED' && (
                            <>
                              {!isCurrent && (
                                <button
                                  onClick={() => handleOpenSuspendModal(u)}
                                  className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-amber-800 border border-slate-300 hover:border-amber-400 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer shrink-0 shadow-xs"
                                  title="Suspend Access"
                                >
                                  <ShieldAlert className="w-3 h-3" />
                                  <span>Suspend</span>
                                </button>
                              )}
                            </>
                          )}

                          {status === 'SUSPENDED' && (
                            <button
                              onClick={() => handleReactivate(u)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer shrink-0"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reactivate</span>
                            </button>
                          )}

                          {!isCurrent && (
                            <button
                              onClick={() => handleOpenDeleteModal(u)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (< 768px) */}
        <div className="block md:hidden divide-y divide-slate-200">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-teal-700 mb-2" />
              <span>Loading personnel records...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-slate-700">No personnel records found.</p>
              <p className="text-[11px] text-slate-500 mt-1">Try changing filter tab or search keywords.</p>
            </div>
          ) : (
            users.map((u) => {
              const uId = u._id || u.id || '';
              const isCurrent = uId === currentUser?.id || u.email.toLowerCase() === currentUser?.email?.toLowerCase();
              const status = u.status || 'APPROVED';

              return (
                <div key={uId} className="p-4 space-y-3 hover:bg-slate-50 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-xs">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-black text-sm flex items-center gap-1.5 flex-wrap">
                          <span className="truncate">{u.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-teal-50 text-teal-800 border border-teal-200 shrink-0 font-semibold">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-600 font-mono truncate">{u.email}</div>
                      </div>
                    </div>
                    <div className="shrink-0">{getStatusBadge(status)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Assigned Role</span>
                      <div className="mt-1">
                        {isCurrent ? (
                          <div className="flex items-center gap-1.5">
                            {getRoleBadge(u.role)}
                            <span className="text-[10px] text-slate-400 font-semibold">(You)</span>
                          </div>
                        ) : (
                          <div className="relative inline-flex items-center w-full">
                            <select
                              value={u.role}
                              disabled={changingRoleId === uId || actionLoading}
                              onChange={(e) => handleQuickRoleChange(u, e.target.value as UserRole)}
                              aria-label={`Change assigned role for ${u.name}`}
                              className={`w-full text-xs font-bold py-1.5 pl-2.5 pr-7 rounded-lg border cursor-pointer focus:outline-none transition appearance-none shadow-xs disabled:opacity-60 ${
                                u.role === 'ADMIN'
                                  ? 'bg-purple-50 text-purple-900 border-purple-300'
                                  : u.role === 'MINE_PLANNER'
                                  ? 'bg-teal-50 text-teal-900 border-teal-300'
                                  : u.role === 'VIEWER'
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : 'bg-blue-50 text-blue-900 border-blue-300'
                              }`}
                            >
                              <option value="ADMIN">Administrator</option>
                              <option value="MINE_PLANNER">Mine Planner</option>
                              <option value="VIEWER">Ministry Auditor</option>
                              <option value="USER">Standard User</option>
                            </select>
                            {changingRoleId === uId ? (
                              <RefreshCw className="w-3.5 h-3.5 text-teal-700 animate-spin absolute right-2 pointer-events-none" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Department</span>
                      <div className="mt-1 text-slate-700 truncate text-[11px]">{u.department || 'MOIL HQ'}</div>
                    </div>
                    {u.createdAt && (
                      <div className="col-span-2 pt-1 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                        <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                        {u.lastLogin && <span>Active: {new Date(u.lastLogin).toLocaleDateString()}</span>}
                      </div>
                    )}
                  </div>

                  {u.rejectionReason && status === 'REJECTED' && (
                    <div className="text-[11px] text-rose-800 bg-rose-50 p-2.5 rounded-lg border border-rose-200 italic">
                      Rejection Reason: {u.rejectionReason}
                    </div>
                  )}

                  {u.suspensionReason && status === 'SUSPENDED' && (
                    <div className="text-[11px] text-slate-700 bg-slate-100 p-2.5 rounded-lg border border-slate-300 italic">
                      Suspension Reason: {u.suspensionReason}
                    </div>
                  )}

                  {/* Actions for Mobile */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {!isCurrent && (
                      <button
                        onClick={() => handleOpenEditRoleModal(u)}
                        className="flex-1 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-300 text-purple-900 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer min-w-[120px]"
                      >
                        <Shield className="w-3.5 h-3.5 text-purple-700" />
                        <span>Change Role</span>
                      </button>
                    )}

                    {status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleOpenApproveModal(u)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleOpenRejectModal(u)}
                          className="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {status === 'APPROVED' && (
                      <>
                        {!isCurrent && (
                          <button
                            onClick={() => handleOpenSuspendModal(u)}
                            className="flex-1 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-slate-300 hover:border-amber-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </button>
                        )}
                      </>
                    )}

                    {status === 'SUSPENDED' && (
                      <button
                        onClick={() => handleReactivate(u)}
                        className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reactivate Access</span>
                      </button>
                    )}

                    {!isCurrent && (
                      <button
                        onClick={() => handleOpenDeleteModal(u)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-300 transition cursor-pointer"
                        title="Delete Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* APPROVE USER MODAL */}
      {modalType === 'APPROVE' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto text-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black">Approve Personnel Registration</h3>
                <p className="text-xs text-slate-600">Send official clearance & activation email</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="text-black font-semibold">{selectedUser.name}</div>
              <div className="text-slate-600 font-mono text-[11px] truncate">{selectedUser.email}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block text-[11px]">Authorize System Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-teal-600 cursor-pointer"
                >
                  <option value="MINE_PLANNER">Mine Planner (Balaghat / Dongri / Kandri)</option>
                  <option value="VIEWER">Ministry Auditor (Auditor / Oversight)</option>
                  <option value="ADMIN">System Administrator (Full Enterprise Control)</option>
                  <option value="USER">Standard User (Basic Access)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block text-[11px]">Assigned Department / Division</label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-teal-600"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-[11px] text-emerald-900 leading-relaxed font-medium">
              Upon approval, a single-use 48-hour secure activation link will be automatically emailed to the applicant.
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer text-center shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Confirm & Send Activation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT USER MODAL */}
      {modalType === 'REJECT' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto text-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black">Disapprove Registration Request</h3>
                <p className="text-xs text-slate-600">Reject applicant and send notification</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="text-black font-semibold">{selectedUser.name}</div>
              <div className="text-slate-600 font-mono text-[11px] truncate">{selectedUser.email}</div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-700 font-semibold block text-[11px]">Reason for Rejection (Optional)</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Clearance verification failed / Invalid departmental authorization."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer text-center shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>Reject Request</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUSPEND USER MODAL */}
      {modalType === 'SUSPEND' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto text-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-600 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black">Suspend Personnel Access</h3>
                <p className="text-xs text-slate-600">Temporarily revoke platform login capability</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="text-black font-semibold">{selectedUser.name}</div>
              <div className="text-slate-600 font-mono text-[11px] truncate">{selectedUser.email}</div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-700 font-semibold block text-[11px]">Suspension Note / Reason</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Routine administrative clearance audit."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer text-center shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>Suspend Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {modalType === 'EDIT_ROLE' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-slate-300 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto text-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-300 flex items-center justify-center text-purple-700 shrink-0 shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black">Change Assigned Role & Clearances</h3>
                <p className="text-xs text-slate-600">Reassign operational permissions for this account</p>
              </div>
            </div>

            {/* Target User Info */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-black font-bold text-sm truncate">{selectedUser.name}</div>
                <div className="text-slate-600 font-mono text-[11px] truncate flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{selectedUser.email}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 block uppercase font-semibold">Current Role</span>
                <div className="mt-0.5">{getRoleBadge(selectedUser.role)}</div>
              </div>
            </div>

            {/* Role Cards Selection */}
            <div className="space-y-2">
              <label className="text-slate-700 font-bold block text-xs">Select New Operational Role</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* ADMIN */}
                <div
                  onClick={() => setEditRole('ADMIN')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                    editRole === 'ADMIN'
                      ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-slate-300 bg-white hover:border-purple-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">
                      Administrator
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${editRole === 'ADMIN' ? 'border-purple-600 bg-purple-600 text-white' : 'border-slate-300'}`}>
                      {editRole === 'ADMIN' && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Full organizational clearance, user approvals, role changes, and system settings.
                  </p>
                </div>

                {/* MINE_PLANNER */}
                <div
                  onClick={() => setEditRole('MINE_PLANNER')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                    editRole === 'MINE_PLANNER'
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-xs'
                      : 'border-slate-300 bg-white hover:border-teal-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-900 border border-teal-300">
                      Mine Planner
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${editRole === 'MINE_PLANNER' ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'}`}>
                      {editRole === 'MINE_PLANNER' && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Formulate mine plans, inspect boreholes, calculate reserves, and run AI shortfall simulations.
                  </p>
                </div>

                {/* VIEWER */}
                <div
                  onClick={() => setEditRole('VIEWER')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                    editRole === 'VIEWER'
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'border-slate-300 bg-white hover:border-emerald-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-300">
                      Ministry Auditor
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${editRole === 'VIEWER' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'}`}>
                      {editRole === 'VIEWER' && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Read-only regulatory oversight for reserve data, geological logs, ESG, and audits.
                  </p>
                </div>

                {/* USER */}
                <div
                  onClick={() => setEditRole('USER')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                    editRole === 'USER'
                      ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                      : 'border-slate-300 bg-white hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-300">
                      Standard User
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${editRole === 'USER' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'}`}>
                      {editRole === 'USER' && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    General personnel access with basic platform dashboard and announcements.
                  </p>
                </div>
              </div>
            </div>

            {/* Department Input */}
            <div className="space-y-1">
              <label className="text-slate-700 font-bold block text-xs">Department / Operational Division</label>
              <div className="relative">
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  placeholder="e.g. Balaghat Planning Division"
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black text-xs font-semibold focus:outline-none focus:border-teal-600"
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Immediate Impact Callout */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-purple-900 leading-relaxed font-medium flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
              <span>
                Role updates take effect immediately on active user sessions. An automated notification email will be dispatched to <strong className="text-purple-950 font-bold">{selectedUser.email}</strong>.
              </span>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer text-center shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Apply Role Change</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE USER MODAL */}
      {modalType === 'DELETE' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-rose-300 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto text-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black">Permanently Delete Account</h3>
                <p className="text-xs text-rose-700 font-semibold">Irreversible administrative action</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Are you sure you want to permanently delete the account for <strong className="text-black">{selectedUser.name}</strong> ({selectedUser.email})? All session tokens will be invalidated.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer text-center shadow-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PERSONNEL / ADMIN MODAL */}
      {modalType === 'CREATE_USER' && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-slate-300 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto text-black">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-300 flex items-center justify-center text-teal-700 shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-black">Directly Provision New Account</h3>
                <p className="text-xs text-slate-600">Create pre-approved Administrator or Staff credentials</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block text-[11px]">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Dr. Rajeshwar Sharma"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block text-[11px]">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="name@moil.gov.in"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black font-mono text-xs focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block text-[11px]">Assigned Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-teal-600 cursor-pointer"
                  >
                    <option value="ADMIN">System Administrator (Full Control)</option>
                    <option value="MINE_PLANNER">Mine Planner</option>
                    <option value="VIEWER">Ministry Auditor (Viewer)</option>
                    <option value="USER">Standard User</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block text-[11px]">Initial Status</label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as 'APPROVED' | 'PENDING')}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-teal-600 cursor-pointer"
                  >
                    <option value="APPROVED">Approved (Immediate Login)</option>
                    <option value="PENDING">Pending (Requires Activation)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block text-[11px]">Department / Unit</label>
                <input
                  type="text"
                  required
                  value={newUserDepartment}
                  onChange={(e) => setNewUserDepartment(e.target.value)}
                  placeholder="e.g. Central Administration Directorate"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold block text-[11px]">Password (Min 6 Characters)</label>
                <div className="relative">
                  <input
                    type={showNewUserPassword ? 'text' : 'password'}
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-black text-xs focus:outline-none focus:border-teal-600"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black transition focus:outline-none cursor-pointer"
                  >
                    {showNewUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold transition cursor-pointer text-center shadow-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                  <span>Provision Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
