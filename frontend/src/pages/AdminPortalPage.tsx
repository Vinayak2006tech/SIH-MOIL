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
  Edit3
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
  const [modalType, setModalType] = useState<'APPROVE' | 'REJECT' | 'SUSPEND' | 'EDIT_ROLE' | 'DELETE' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('MINE_PLANNER');
  const [editDepartment, setEditDepartment] = useState('');

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

  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
    setActionReason('');
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
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-700">Administrator</span>;
      case 'MINE_PLANNER':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/80 text-blue-300 border border-blue-700">Mine Planner</span>;
      case 'VIEWER':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700">Ministry Auditor</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">{role}</span>;
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
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800/90 text-slate-300 border border-slate-600 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Suspended
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-2xl border shadow-2xl flex items-center gap-3 animate-fadeIn text-xs max-w-md ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100'
              : toast.type === 'error'
              ? 'bg-rose-950/95 border-rose-500 text-rose-100'
              : 'bg-indigo-950/95 border-indigo-500 text-indigo-100'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
          )}
          <span className="font-medium leading-relaxed">{toast.message}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-900/60 text-purple-300 border border-purple-700">
                ADMINISTRATION & SECURITY PORTAL
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              Personnel Access & Approval Registry
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl">
              Authorized administrators can review personnel registration requests, grant clearance, assign operational roles, and manage access security.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={fetchUsersAndStats}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Records</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveTab('ALL')}
          className={`glass-panel p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
            activeTab === 'ALL'
              ? 'border-purple-500/80 bg-purple-950/20 shadow-glow-purple'
              : 'border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-2">
            <span>Total Personnel</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.totalUsers}</div>
          <p className="text-[10px] text-slate-400 mt-1">All registered accounts</p>
        </div>

        <div
          onClick={() => setActiveTab('PENDING')}
          className={`glass-panel p-4 sm:p-5 rounded-2xl border transition cursor-pointer relative ${
            activeTab === 'PENDING'
              ? 'border-amber-500/80 bg-amber-950/20 shadow-glow-amber'
              : stats.pendingUsers > 0
              ? 'border-amber-700/60 bg-amber-950/10'
              : 'border-slate-800/80 hover:border-slate-700'
          }`}
        >
          {stats.pendingUsers > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
          )}
          <div className="flex items-center justify-between text-amber-300 text-xs font-semibold mb-2">
            <span>Pending Clearance</span>
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-amber-300">{stats.pendingUsers}</div>
          <p className="text-[10px] text-amber-200/70 mt-1">Awaiting your approval</p>
        </div>

        <div
          onClick={() => setActiveTab('APPROVED')}
          className={`glass-panel p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
            activeTab === 'APPROVED'
              ? 'border-emerald-500/80 bg-emerald-950/20 shadow-glow-emerald'
              : 'border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-300 text-xs font-semibold mb-2">
            <span>Approved & Active</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">{stats.approvedUsers}</div>
          <p className="text-[10px] text-emerald-200/70 mt-1">Active platform credentials</p>
        </div>

        <div
          onClick={() => setActiveTab('SUSPENDED')}
          className={`glass-panel p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
            activeTab === 'SUSPENDED'
              ? 'border-slate-500 bg-slate-800/40'
              : 'border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-slate-300 text-xs font-semibold mb-2">
            <span>Suspended</span>
            <ShieldAlert className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-300">{stats.suspendedUsers}</div>
          <p className="text-[10px] text-slate-400 mt-1">Temporarily locked</p>
        </div>

        <div
          onClick={() => setActiveTab('REJECTED')}
          className={`glass-panel p-4 sm:p-5 rounded-2xl border transition cursor-pointer ${
            activeTab === 'REJECTED'
              ? 'border-rose-500/80 bg-rose-950/20'
              : 'border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-rose-300 text-xs font-semibold mb-2">
            <span>Rejected</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-300">{stats.rejectedUsers}</div>
          <p className="text-[10px] text-rose-200/70 mt-1">Disapproved requests</p>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Tab buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(
              [
                { key: 'ALL', label: 'All Users', count: stats.totalUsers },
                { key: 'PENDING', label: 'Pending Approvals', count: stats.pendingUsers, highlight: true },
                { key: 'APPROVED', label: 'Approved', count: stats.approvedUsers },
                { key: 'SUSPENDED', label: 'Suspended', count: stats.suspendedUsers },
                { key: 'REJECTED', label: 'Rejected', count: stats.rejectedUsers }
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === t.key
                    ? t.highlight && t.count > 0
                      ? 'bg-amber-500 text-slate-950 shadow-glow-amber'
                      : 'bg-purple-600 text-white shadow-glow-purple'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                    activeTab === t.key
                      ? 'bg-black/20 text-current'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Role Filter */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, department..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="ALL">All Roles</option>
              <option value="MINE_PLANNER">Mine Planners</option>
              <option value="ADMIN">Administrators</option>
              <option value="VIEWER">Ministry Auditors</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Registry Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-bold">Personnel Details</th>
                <th className="px-4 py-3.5 font-bold">Assigned Role</th>
                <th className="px-4 py-3.5 font-bold">Department / Division</th>
                <th className="px-4 py-3.5 font-bold">Clearance Status</th>
                <th className="px-4 py-3.5 font-bold">Timeline & Activity</th>
                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-400 mb-2" />
                    <span>Loading authorized personnel records...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-300">No personnel records found.</p>
                    <p className="text-[11px] text-slate-500">Try changing filter tab or search keywords.</p>
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const uId = u._id || u.id || '';
                  const isCurrent = uId === currentUser?.id || u.email.toLowerCase() === currentUser?.email?.toLowerCase();
                  const status = u.status || 'APPROVED';

                  return (
                    <tr key={uId} className="hover:bg-slate-800/40 transition">
                      {/* Name & Email */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-700 to-indigo-900 border border-purple-500/30 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-sm">
                            {u.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-900 text-purple-200 border border-purple-700">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-4 py-4">{getRoleBadge(u.role)}</td>

                      {/* Department */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Building className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[160px]">{u.department || 'MOIL HQ'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          {getStatusBadge(status)}
                          {u.rejectionReason && status === 'REJECTED' && (
                            <div className="text-[10px] text-rose-300/80 italic max-w-xs truncate">
                              Reason: {u.rejectionReason}
                            </div>
                          )}
                          {u.suspensionReason && status === 'SUSPENDED' && (
                            <div className="text-[10px] text-slate-400 italic max-w-xs truncate">
                              Reason: {u.suspensionReason}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-4 py-4 text-[11px] text-slate-400">
                        <div className="space-y-0.5">
                          {u.createdAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
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
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          {status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleOpenApproveModal(u)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-sm transition cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(u)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700 text-rose-200 font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer"
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
                                className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                                title="Edit Role & Department"
                              >
                                <Edit3 className="w-3 h-3 text-purple-400" />
                                <span>Edit</span>
                              </button>

                              {!isCurrent && (
                                <button
                                  onClick={() => handleOpenSuspendModal(u)}
                                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-950/60 text-amber-300 border border-slate-700 hover:border-amber-700 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
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
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Reactivate</span>
                            </button>
                          )}

                          {!isCurrent && (
                            <button
                              onClick={() => handleOpenDeleteModal(u)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition cursor-pointer"
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
      </div>

      {/* APPROVE USER MODAL */}
      {modalType === 'APPROVE' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Approve Personnel Registration</h3>
                <p className="text-xs text-slate-400">Send official clearance & activation email</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="text-slate-300 font-semibold">{selectedUser.name}</div>
              <div className="text-slate-400 font-mono text-[11px]">{selectedUser.email}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">Authorize System Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
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
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-800/60 rounded-xl text-[11px] text-emerald-300 leading-relaxed">
              Upon approval, a single-use 48-hour secure activation link will be automatically emailed to the applicant.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <XCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Disapprove Registration Request</h3>
                <p className="text-xs text-slate-400">Reject applicant and send notification</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="text-slate-300 font-semibold">{selectedUser.name}</div>
              <div className="text-slate-400 font-mono text-[11px]">{selectedUser.email}</div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-semibold block text-[11px]">Reason for Rejection (Optional)</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Clearance verification failed / Invalid departmental authorization."
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Suspend Personnel Access</h3>
                <p className="text-xs text-slate-400">Temporarily revoke platform login capability</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="text-slate-300 font-semibold">{selectedUser.name}</div>
              <div className="text-slate-400 font-mono text-[11px]">{selectedUser.email}</div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-300 font-semibold block text-[11px]">Suspension Note / Reason</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Routine administrative clearance audit."
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspend}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Update Permissions & Unit</h3>
                <p className="text-xs text-slate-400">Modify operational privileges</p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="text-slate-300 font-semibold">{selectedUser.name}</div>
              <div className="text-slate-400 font-mono text-[11px]">{selectedUser.email}</div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block text-[11px]">System Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
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
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-panel bg-slate-900 border border-rose-800/80 rounded-3xl p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Permanently Delete Account</h3>
                <p className="text-xs text-rose-300">Irreversible administrative action</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete the account for <strong className="text-white">{selectedUser.name}</strong> ({selectedUser.email})? All session tokens will be invalidated.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {actionLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
