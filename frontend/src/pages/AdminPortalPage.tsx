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
  EyeOff
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
    setSelectedUser(u);
    setEditRole(u.role);
    setEditDepartment(u.department || '');
    setModalType('EDIT_ROLE');
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
        department: editDepartment
      });
      showToast('success', res.message || `Permissions for ${selectedUser.name} updated.`);
      closeModal();
      fetchUsersAndStats();
    } catch (err: any) {
      showToast('error', err.response?.data?.message || 'Update failed.');
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
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-manganese-900/80 text-manganese-200 border border-manganese-700 whitespace-nowrap">Administrator</span>;
      case 'MINE_PLANNER':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-tech-teal/20 text-tech-teal border border-tech-teal/40 whitespace-nowrap">Mine Planner</span>;
      case 'VIEWER':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700 whitespace-nowrap">Ministry Auditor</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0F1214] text-[#94A3B8] border border-[#26333B] whitespace-nowrap">{role}</span>;
    }
  };

  const getStatusBadge = (status?: UserStatus) => {
    const st = status || 'APPROVED';
    switch (st) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-950/70 text-amber-300 border border-amber-600/80 shadow-sm animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending Approval
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-600/80 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Approved & Active
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-950/70 text-rose-300 border border-rose-600/80 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Rejected
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#161D22] text-[#94A3B8] border border-[#26333B] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Suspended
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn text-[#E8E6E3] w-full max-w-full min-w-0">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 left-4 sm:left-auto sm:right-4 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-fadeIn text-xs max-w-md ${toast.type === 'success'
            ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100'
            : toast.type === 'error'
              ? 'bg-rose-950/95 border-rose-500 text-rose-100'
              : 'bg-[#161D22]/95 border-tech-teal text-tech-teal'
            }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-tech-teal shrink-0" />
          )}
          <span className="font-medium leading-relaxed">{toast.message}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="glass-panel bg-[#161D22]/85 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#26333B] relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-manganese-900/60 text-manganese-200 border border-manganese-700">
                ADMINISTRATION & SECURITY PORTAL
              </span>
              <span className="w-2 h-2 rounded-full bg-tech-teal animate-pulse shrink-0" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#E8E6E3] tracking-tight flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-tech-teal shrink-0" />
              <span className="break-words">Personnel Access & Approval Registry</span>
            </h1>
            <p className="text-xs text-[#94A3B8] max-w-2xl leading-relaxed">
              Authorized administrators can review personnel registration requests, grant clearance, assign operational roles, and manage access security.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0 flex-wrap">
            <button
              onClick={handleOpenCreateUserModal}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-[#0F1214] font-extrabold text-xs flex items-center justify-center gap-2 shadow-glow-teal transition cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Provision Personnel / Admin</span>
            </button>
            <button
              onClick={fetchUsersAndStats}
              disabled={loading}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#0F1214] hover:bg-[#1B2226] border border-[#26333B] text-[#E8E6E3] text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
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
          className={`glass-panel p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer ${activeTab === 'ALL'
            ? 'border-tech-teal/80 bg-tech-teal/10 shadow-glow-teal'
            : 'border-[#26333B] bg-[#161D22]/85 hover:border-slate-600'
            }`}
        >
          <div className="flex items-center justify-between text-[#94A3B8] text-xs font-semibold mb-1.5 sm:mb-2 gap-1">
            <span className="truncate">Total Personnel</span>
            <Users className="w-4 h-4 text-tech-teal shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#E8E6E3]">{stats.totalUsers}</div>
          <p className="text-[10px] text-[#94A3B8] mt-1 truncate">All registered accounts</p>
        </div>

        <div
          onClick={() => setActiveTab('PENDING')}
          className={`glass-panel p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer relative ${activeTab === 'PENDING'
            ? 'border-amber-500/80 bg-amber-950/20 shadow-glow-amber'
            : stats.pendingUsers > 0
              ? 'border-amber-700/60 bg-amber-950/10'
              : 'border-[#26333B] bg-[#161D22]/85 hover:border-slate-600'
            }`}
        >
          {stats.pendingUsers > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
          )}
          <div className="flex items-center justify-between text-amber-300 text-xs font-semibold mb-1.5 sm:mb-2 gap-1">
            <span className="truncate">Pending Clearance</span>
            <Clock className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300">{stats.pendingUsers}</div>
          <p className="text-[10px] text-amber-200/70 mt-1 truncate">Awaiting approval</p>
        </div>

        <div
          onClick={() => setActiveTab('APPROVED')}
          className={`glass-panel p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer ${activeTab === 'APPROVED'
            ? 'border-emerald-500/80 bg-emerald-950/20 shadow-glow-emerald'
            : 'border-[#26333B] bg-[#161D22]/85 hover:border-slate-600'
            }`}
        >
          <div className="flex items-center justify-between text-emerald-300 text-xs font-semibold mb-1.5 sm:mb-2 gap-1">
            <span className="truncate">Approved & Active</span>
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-300">{stats.approvedUsers}</div>
          <p className="text-[10px] text-emerald-200/70 mt-1 truncate">Active platform accounts</p>
        </div>

        <div
          onClick={() => setActiveTab('SUSPENDED')}
          className={`glass-panel p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer ${activeTab === 'SUSPENDED'
            ? 'border-slate-500 bg-[#1B2226]'
            : 'border-[#26333B] bg-[#161D22]/85 hover:border-slate-600'
            }`}
        >
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold mb-1.5 sm:mb-2 gap-1">
            <span className="truncate">Suspended</span>
            <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-300">{stats.suspendedUsers}</div>
          <p className="text-[10px] text-[#94A3B8] mt-1 truncate">Temporarily locked</p>
        </div>

        <div
          onClick={() => setActiveTab('REJECTED')}
          className={`glass-panel p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition cursor-pointer col-span-2 sm:col-span-1 ${activeTab === 'REJECTED'
            ? 'border-rose-500/80 bg-rose-950/20'
            : 'border-[#26333B] bg-[#161D22]/85 hover:border-slate-600'
            }`}
        >
          <div className="flex items-center justify-between text-rose-300 text-xs font-semibold mb-1.5 sm:mb-2 gap-1">
            <span className="truncate">Rejected</span>
            <UserX className="w-4 h-4 text-rose-400 shrink-0" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-300">{stats.rejectedUsers}</div>
          <p className="text-[10px] text-rose-200/70 mt-1 truncate">Disapproved requests</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="glass-panel bg-[#161D22]/85 p-3.5 sm:p-4 rounded-2xl border border-[#26333B] space-y-3 sm:space-y-4 shadow-xl">
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
                    ? 'bg-amber-500 text-[#0F1214] shadow-glow-amber'
                    : 'bg-tech-teal text-[#0F1214] font-extrabold shadow-glow-teal'
                  : 'bg-[#0F1214] hover:bg-[#1B2226] text-[#94A3B8] hover:text-[#E8E6E3] border border-[#26333B]'
                  }`}
              >
                <span>{t.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${activeTab === t.key
                    ? 'bg-black/20 text-current'
                    : 'bg-[#161D22] text-[#94A3B8]'
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
                className="w-full pl-9 pr-3 py-2 bg-[#0F1214] border border-[#26333B] rounded-xl text-xs text-[#E8E6E3] placeholder:text-slate-500 focus:outline-none focus:border-tech-teal font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-[#0F1214] border border-[#26333B] rounded-xl text-xs text-[#E8E6E3] focus:outline-none focus:border-tech-teal cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="MINE_PLANNER">Mine Planners</option>
              <option value="ADMIN">Administrators</option>
              <option value="VIEWER">Ministry Auditors</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Registry Table & Cards */}
      <div className="glass-panel bg-[#161D22]/85 rounded-2xl sm:rounded-3xl border border-[#26333B] overflow-hidden shadow-xl">
        {/* Desktop / Tablet Table View (>= 768px) */}
        <div className="hidden md:block overflow-x-auto w-full scrollbar-thin">
          <table className="w-full min-w-[880px] text-left text-xs">
            <thead className="bg-[#0F1214]/90 text-[#94A3B8] uppercase tracking-wider text-[10px] border-b border-[#26333B]">
              <tr>
                <th className="px-5 py-3.5 font-bold min-w-[220px]">Personnel Details</th>
                <th className="px-4 py-3.5 font-bold whitespace-nowrap min-w-[130px]">Assigned Role</th>
                <th className="px-4 py-3.5 font-bold min-w-[160px]">Department / Division</th>
                <th className="px-4 py-3.5 font-bold whitespace-nowrap min-w-[140px]">Clearance Status</th>
                <th className="px-4 py-3.5 font-bold whitespace-nowrap min-w-[140px]">Timeline & Activity</th>
                <th className="px-5 py-3.5 font-bold text-right whitespace-nowrap min-w-[170px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26333B]/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#94A3B8]">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-tech-teal mb-2" />
                    <span>Loading authorized personnel records...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#94A3B8]">
                    <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-300">No personnel records found.</p>
                    <p className="text-[11px] text-[#94A3B8]">Try changing filter tab or search keywords.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const uId = u._id || u.id || '';
                  const isCurrent = uId === currentUser?.id || u.email.toLowerCase() === currentUser?.email?.toLowerCase();
                  const status = u.status || 'APPROVED';

                  return (
                    <tr key={uId} className="hover:bg-[#1B2226]/60 transition">
                      {/* Name & Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-manganese-700 to-tech-teal/80 border border-tech-teal/30 flex items-center justify-center font-bold text-[#0F1214] text-xs shrink-0 shadow-sm">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[#E8E6E3] flex items-center gap-1.5">
                              <span className="truncate">{u.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-tech-teal/20 text-tech-teal border border-tech-teal/40 shrink-0">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#94A3B8] font-mono flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate">{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4 whitespace-nowrap">{getRoleBadge(u.role)}</td>

                      {/* Department */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[180px]">{u.department || 'MOIL HQ'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          {getStatusBadge(status)}
                          {u.rejectionReason && status === 'REJECTED' && (
                            <div className="text-[10px] text-rose-300/80 italic max-w-xs truncate">
                              Reason: {u.rejectionReason}
                            </div>
                          )}
                          {u.suspensionReason && status === 'SUSPENDED' && (
                            <div className="text-[10px] text-[#94A3B8] italic max-w-xs truncate">
                              Reason: {u.suspensionReason}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-4 text-[11px] text-[#94A3B8] whitespace-nowrap font-mono">
                        <div className="space-y-0.5">
                          {u.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
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
                          {status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleOpenApproveModal(u)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition cursor-pointer shrink-0"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(u)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-200 font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer shrink-0"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {status === 'APPROVED' && (
                            <>
                              <button
                                onClick={() => handleOpenEditRoleModal(u)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#0F1214] hover:bg-[#1B2226] border border-[#26333B] text-[#E8E6E3] text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
                                title="Edit Role & Department"
                              >
                                <Edit3 className="w-3 h-3 text-tech-teal" />
                                <span>Edit</span>
                              </button>

                              {!isCurrent && (
                                <button
                                  onClick={() => handleOpenSuspendModal(u)}
                                  className="px-2.5 py-1.5 rounded-lg bg-[#0F1214] hover:bg-amber-950/60 text-amber-300 border border-[#26333B] hover:border-amber-700 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
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
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer shrink-0"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reactivate</span>
                            </button>
                          )}

                          {!isCurrent && (
                            <button
                              onClick={() => handleOpenDeleteModal(u)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer shrink-0"
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
        <div className="block md:hidden divide-y divide-[#26333B]/80">
          {loading ? (
            <div className="p-8 text-center text-[#94A3B8]">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-tech-teal mb-2" />
              <span>Loading personnel records...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-[#94A3B8]">
              <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="font-semibold text-slate-300">No personnel records found.</p>
              <p className="text-[11px] text-[#94A3B8] mt-1">Try changing filter tab or search keywords.</p>
            </div>
          ) : (
            users.map((u) => {
              const uId = u._id || u.id || '';
              const isCurrent = uId === currentUser?.id || u.email.toLowerCase() === currentUser?.email?.toLowerCase();
              const status = u.status || 'APPROVED';

              return (
                <div key={uId} className="p-4 space-y-3 hover:bg-[#1B2226]/40 transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-manganese-700 to-tech-teal/80 border border-tech-teal/30 flex items-center justify-center font-bold text-[#0F1214] text-xs shrink-0 shadow-sm">
                        {u.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[#E8E6E3] text-sm flex items-center gap-1.5 flex-wrap">
                          <span className="truncate">{u.name}</span>
                          {isCurrent && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-tech-teal/20 text-tech-teal border border-tech-teal/40 shrink-0">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] font-mono truncate">{u.email}</div>
                      </div>
                    </div>
                    <div className="shrink-0">{getStatusBadge(status)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-[#0F1214]/80 p-3 rounded-xl border border-[#26333B]">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Role</span>
                      <div className="mt-1">{getRoleBadge(u.role)}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Department</span>
                      <div className="mt-1 text-slate-300 truncate text-[11px]">{u.department || 'MOIL HQ'}</div>
                    </div>
                    {u.createdAt && (
                      <div className="col-span-2 pt-1 border-t border-[#26333B] flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
                        <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                        {u.lastLogin && <span>Active: {new Date(u.lastLogin).toLocaleDateString()}</span>}
                      </div>
                    )}
                  </div>

                  {u.rejectionReason && status === 'REJECTED' && (
                    <div className="text-[11px] text-rose-300 bg-rose-950/40 p-2.5 rounded-lg border border-rose-900/50 italic">
                      Rejection Reason: {u.rejectionReason}
                    </div>
                  )}

                  {u.suspensionReason && status === 'SUSPENDED' && (
                    <div className="text-[11px] text-[#94A3B8] bg-[#0F1214] p-2.5 rounded-lg border border-[#26333B] italic">
                      Suspension Reason: {u.suspensionReason}
                    </div>
                  )}

                  {/* Actions for Mobile */}
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleOpenApproveModal(u)}
                          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleOpenRejectModal(u)}
                          className="flex-1 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}

                    {status === 'APPROVED' && (
                      <>
                        <button
                          onClick={() => handleOpenEditRoleModal(u)}
                          className="flex-1 py-2 rounded-xl bg-[#0F1214] hover:bg-[#1B2226] border border-[#26333B] text-[#E8E6E3] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-tech-teal" />
                          <span>Edit Role</span>
                        </button>

                        {!isCurrent && (
                          <button
                            onClick={() => handleOpenSuspendModal(u)}
                            className="flex-1 py-2 rounded-xl bg-[#0F1214] hover:bg-amber-950/60 text-amber-300 border border-[#26333B] hover:border-amber-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
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
                        className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reactivate Access</span>
                      </button>
                    )}

                    {!isCurrent && (
                      <button
                        onClick={() => handleOpenDeleteModal(u)}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 bg-[#0F1214] hover:bg-rose-950/40 border border-[#26333B] transition"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md glass-panel bg-[#161D22] border border-[#26333B] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#E8E6E3]">Approve Personnel Registration</h3>
                <p className="text-xs text-[#94A3B8]">Send official clearance & activation email</p>
              </div>
            </div>

            <div className="bg-[#0F1214] p-3.5 rounded-xl border border-[#26333B] text-xs space-y-1.5">
              <div className="text-slate-300 font-semibold">{selectedUser.name}</div>
              <div className="text-[#94A3B8] font-mono text-[11px] truncate">{selectedUser.email}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Authorize System Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="MINE_PLANNER">Mine Planner (Balaghat / Dongri / Kandri)</option>
                  <option value="VIEWER">Ministry Auditor (Auditor / Oversight)</option>
                  <option value="ADMIN">System Administrator (Full Enterprise Control)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Assigned Department / Division</label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-xl text-[11px] text-emerald-300 leading-relaxed">
              Upon approval, a single-use 48-hour secure activation link will be automatically emailed to the applicant.
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0F1214] hover:bg-[#1B2226] border border-[#26333B] text-[#94A3B8] text-xs font-semibold transition cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-tech-teal hover:from-emerald-500 hover:to-tech-teal text-[#0F1214] font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md glass-panel bg-[#161D22] border border-[#26333B] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#E8E6E3]">Disapprove Registration Request</h3>
                <p className="text-xs text-[#94A3B8]">Reject applicant and send notification</p>
              </div>
            </div>

            <div className="bg-[#0F1214] p-3 rounded-xl border border-[#26333B] text-xs space-y-1">
              <div className="text-slate-300 font-semibold">{selectedUser.name}</div>
              <div className="text-[#94A3B8] font-mono text-[11px] truncate">{selectedUser.email}</div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-semibold block text-[11px]">Reason for Rejection (Optional)</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Clearance verification failed / Invalid departmental authorization."
                rows={3}
                className="w-full px-3 py-2 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0F1214] hover:bg-[#1B2226] border border-[#26333B] text-[#94A3B8] text-xs font-semibold transition cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md glass-panel bg-[#161D22] border border-[#26333B] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#E8E6E3]">Suspend Personnel Access</h3>
                <p className="text-xs text-[#94A3B8]">Temporarily revoke platform login capability</p>
              </div>
            </div>

            <div className="bg-[#0F1214] p-3 rounded-xl border border-[#26333B] text-xs space-y-1">
              <div className="text-slate-300 font-semibold">{selectedUser.name}</div>
              <div className="text-[#94A3B8] font-mono text-[11px] truncate">{selectedUser.email}</div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-semibold block text-[11px]">Suspension Note / Reason</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Routine administrative clearance audit."
                rows={3}
                className="w-full px-3 py-2 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0F1214] hover:bg-[#1B2226] border border-[#26333B] text-[#94A3B8] text-xs font-semibold transition cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-[#0F1214] text-xs font-bold shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md glass-panel bg-[#161D22] border border-[#26333B] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tech-teal/20 border border-tech-teal/40 flex items-center justify-center text-tech-teal shrink-0">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#E8E6E3]">Update Permissions & Unit</h3>
                <p className="text-xs text-[#94A3B8]">Modify operational privileges</p>
              </div>
            </div>

            <div className="bg-[#0F1214] p-3 rounded-xl border border-[#26333B] text-xs space-y-1">
              <div className="text-slate-300 font-semibold">{selectedUser.name}</div>
              <div className="text-[#94A3B8] font-mono text-[11px] truncate">{selectedUser.email}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">System Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-tech-teal cursor-pointer"
                >
                  <option value="MINE_PLANNER">Mine Planner</option>
                  <option value="VIEWER">Ministry Auditor</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Department</label>
                <input
                  type="text"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-tech-teal"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0F1214] hover:bg-[#1B2226] border border-[#26333B] text-[#94A3B8] text-xs font-semibold transition cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-[#0F1214] font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>Save Permissions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE USER MODAL */}
      {modalType === 'DELETE' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-md glass-panel bg-[#161D22] border border-rose-800/80 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#E8E6E3]">Permanently Delete Account</h3>
                <p className="text-xs text-rose-300">Irreversible administrative action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the account for <strong className="text-white">{selectedUser.name}</strong> ({selectedUser.email})? All session tokens will be invalidated.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0F1214] hover:bg-[#1B2226] border border-[#26333B] text-[#94A3B8] text-xs font-semibold transition cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-lg glass-panel bg-[#161D22] border border-[#26333B] rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl animate-fadeIn my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tech-teal/20 border border-tech-teal/40 flex items-center justify-center text-tech-teal shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#E8E6E3]">Directly Provision New Account</h3>
                <p className="text-xs text-[#94A3B8]">Create pre-approved Administrator or Staff credentials</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Dr. Rajeshwar Sharma"
                  className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-tech-teal"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Official Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="name@moil.gov.in"
                  className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] font-mono text-xs focus:outline-none focus:border-tech-teal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block text-[11px]">Assigned Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-tech-teal cursor-pointer"
                  >
                    <option value="ADMIN">System Administrator (Full Control)</option>
                    <option value="MINE_PLANNER">Mine Planner</option>
                    <option value="VIEWER">Ministry Auditor (Viewer)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block text-[11px]">Initial Status</label>
                  <select
                    value={newUserStatus}
                    onChange={(e) => setNewUserStatus(e.target.value as 'APPROVED' | 'PENDING')}
                    className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-tech-teal cursor-pointer"
                  >
                    <option value="APPROVED">Approved (Immediate Login)</option>
                    <option value="PENDING">Pending (Requires Activation)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Department / Unit</label>
                <input
                  type="text"
                  required
                  value={newUserDepartment}
                  onChange={(e) => setNewUserDepartment(e.target.value)}
                  placeholder="e.g. Central Administration Directorate"
                  className="w-full px-3 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-tech-teal"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Password (Min 6 Characters)</label>
                <div className="relative">
                  <input
                    type={showNewUserPassword ? 'text' : 'password'}
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-[#0F1214] border border-[#26333B] rounded-xl text-[#E8E6E3] text-xs focus:outline-none focus:border-tech-teal"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowNewUserPassword(!showNewUserPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition focus:outline-none cursor-pointer"
                  >
                    {showNewUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-3 border-t border-[#26333B]">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0F1214] hover:bg-[#1B2226] border border-[#26333B] text-[#94A3B8] text-xs font-semibold transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-manganese-600 to-tech-teal hover:from-manganese-500 hover:to-tech-teal text-[#0F1214] font-extrabold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
