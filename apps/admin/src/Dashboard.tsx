import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle, AlertOctagon, Coins, LogOut, Search, 
  ArrowUpDown, Plus, Edit2, Filter, Save, Ban, ShieldCheck,
  ChevronLeft, ChevronRight, X, UserPlus, RefreshCw, Mail, Phone, MapPin, Briefcase, Calendar
} from 'lucide-react';
import api from './axiosInstance';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  location?: string;
  jobTitle?: string;
  isVerified: boolean;
  tokens: number;
  plan: 'FREE' | 'PRO';
  isBanned: boolean;
  bannedUntil?: string;
  banReason?: string;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  proUsers: number;
  bannedUsers: number;
  totalResumes: number;
  totalPortfolios: number;
  totalTokens: number;
}

interface DashboardProps {
  onLogout: () => void;
  adminInfo: { email: string; name: string };
}

export function Dashboard({ onLogout, adminInfo }: DashboardProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    proUsers: 0,
    bannedUsers: 0,
    totalResumes: 0,
    totalPortfolios: 0,
    totalTokens: 0
  });

  // Query & state controls
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    jobTitle: '',
    plan: 'FREE',
    tokens: '5'
  });

  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    bio: ''
  });

  const [tokenInput, setTokenInput] = useState('');
  const [planInput, setPlanInput] = useState<'FREE' | 'PRO'>('FREE');
  const [banDaysInput, setBanDaysInput] = useState('');
  const [banReasonInput, setBanReasonInput] = useState('');

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        api.get('/admin/users', {
          params: {
            page,
            search,
            plan: planFilter,
            status: statusFilter,
            sortBy,
            sortOrder,
            limit: 8
          }
        }),
        api.get('/admin/stats')
      ]);

      if (usersRes.data?.success) {
        setUsers(usersRes.data.data.users);
        setTotalPages(usersRes.data.data.pagination.totalPages);
        setTotalUsersCount(usersRes.data.data.pagination.totalUsers);
      }
      if (statsRes.data?.success) {
        setStats(statsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, planFilter, statusFilter, sortBy, sortOrder]);

  const handleToggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  // Create User
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/users', {
        ...createForm,
        tokens: parseFloat(createForm.tokens)
      });
      if (res.data?.success) {
        setShowCreateModal(false);
        setCreateForm({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          jobTitle: '',
          plan: 'FREE',
          tokens: '5'
        });
        fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create user');
    }
  };

  // Edit User Details
  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || '',
      location: user.location || '',
      jobTitle: user.jobTitle || '',
      bio: user.bio || ''
    });
    setTokenInput(user.tokens.toString());
    setPlanInput(user.plan);
    setBanDaysInput('');
    setBanReasonInput(user.banReason || '');
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const res = await api.put(`/admin/users/${selectedUser.id}`, editForm);
      if (res.data?.success) {
        fetchData();
        setSelectedUser(prev => prev ? { ...prev, ...editForm } : null);
        alert('User details updated successfully');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user details');
    }
  };

  // Give Plan (PRO/FREE)
  const handleUpdatePlan = async () => {
    if (!selectedUser) return;
    try {
      const res = await api.put(`/admin/users/${selectedUser.id}/plan`, { plan: planInput });
      if (res.data?.success) {
        fetchData();
        setSelectedUser(prev => prev ? { ...prev, plan: planInput } : null);
        alert(`Plan updated to ${planInput}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update plan');
    }
  };

  // Give Tokens
  const handleUpdateTokens = async () => {
    if (!selectedUser) return;
    try {
      const res = await api.put(`/admin/users/${selectedUser.id}/tokens`, { tokens: parseFloat(tokenInput) });
      if (res.data?.success) {
        fetchData();
        setSelectedUser(prev => prev ? { ...prev, tokens: parseFloat(tokenInput) } : null);
        alert('Tokens updated successfully');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update tokens');
    }
  };

  // Ban/Unban User
  const handleBanToggle = async (banStatus: boolean) => {
    if (!selectedUser) return;

    try {
      const res = await api.put(`/admin/users/${selectedUser.id}/ban`, {
        isBanned: banStatus,
        days: banDaysInput ? parseInt(banDaysInput) : null,
        reason: banReasonInput
      });

      if (res.data?.success) {
        fetchData();
        setSelectedUser(prev => prev ? { 
          ...prev, 
          isBanned: banStatus, 
          bannedUntil: res.data.data.bannedUntil, 
          banReason: res.data.data.banReason 
        } : null);
        alert(banStatus ? 'User banned successfully' : 'User unbanned successfully');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update ban status');
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800">
      
      {/* Header matching BuildForJob header bar */}
      <header className="h-16 flex shrink-0 items-center justify-between border-b border-black/5 px-6 lg:px-8 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Admin Console</h1>
            <p className="text-[10px] text-primary font-bold uppercase tracking-wider">Overview</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">{adminInfo.name}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">{adminInfo.email}</p>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 border border-black/5 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.99]"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">

        {/* Stats Cards Grid matching StatsTracker card border */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm flex flex-col justify-between h-full backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-primary font-semibold mb-4 text-sm uppercase tracking-wider">
              <Users className="w-4 h-4 shrink-0" />
              <span>Total Users</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalUsers}</h3>
          </div>

          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm flex flex-col justify-between h-full backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-emerald-600 font-semibold mb-4 text-sm uppercase tracking-wider">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>PRO Users</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.proUsers}</h3>
          </div>

          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm flex flex-col justify-between h-full backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-red-600 font-semibold mb-4 text-sm uppercase tracking-wider">
              <Ban className="w-4 h-4 shrink-0" />
              <span>Banned Users</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.bannedUsers}</h3>
          </div>

          <div className="rounded-2xl border border-gray-300 bg-white p-6 shadow-sm flex flex-col justify-between h-full backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-amber-600 font-semibold mb-4 text-sm uppercase tracking-wider">
              <Coins className="w-4 h-4 shrink-0" />
              <span>Tokens Active</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{stats.totalTokens.toFixed(1)}</h3>
          </div>

        </section>

        {/* User Management Toolbar */}
        <section className="bg-white border border-gray-300 rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between backdrop-blur-xl">
          <div className="flex-1 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-primary transition-all text-slate-900"
              />
            </div>

            {/* Sort Controls - NEW: Interactive Dropdown to Sort by Date Time and other options */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const parts = e.target.value.split('-');
                  const field = parts[0] || 'createdAt';
                  const order = (parts[1] as 'asc' | 'desc') || 'desc';
                  setSortBy(field);
                  setSortOrder(order);
                  setPage(1);
                }}
                className="bg-transparent text-sm text-slate-700 focus:outline-none pr-6 cursor-pointer font-semibold"
              >
                <option value="createdAt-desc">Joined Date (Newest First)</option>
                <option value="createdAt-asc">Joined Date (Oldest First)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="tokens-desc">Tokens (Highest First)</option>
                <option value="tokens-asc">Tokens (Lowest First)</option>
                <option value="plan-desc">Plan Type (PRO First)</option>
                <option value="plan-asc">Plan Type (FREE First)</option>
              </select>
            </div>

            {/* Plan Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={planFilter}
                onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
                className="bg-transparent text-sm text-slate-700 focus:outline-none pr-6 cursor-pointer font-semibold"
              >
                <option value="">All Plans</option>
                <option value="FREE">FREE</option>
                <option value="PRO">PRO</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="bg-transparent text-sm text-slate-700 focus:outline-none pr-6 cursor-pointer font-semibold"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>

          </div>

          {/* Create User Button */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-full text-sm font-semibold transition-all shadow-md shadow-primary/20 cursor-pointer text-center whitespace-nowrap active:scale-[0.98] hover:brightness-110"
          >
            <UserPlus className="w-4 h-4" />
            Create User
          </button>
        </section>

        {/* Users Table */}
        <section className="bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm relative min-h-[300px] backdrop-blur-xl">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4 w-1/4">
                    <button 
                      onClick={() => handleToggleSort('name')} 
                      className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      User Details
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="px-6 py-4 w-1/4">Contact & Location</th>
                  <th className="px-6 py-4 w-1/6">
                    <button 
                      onClick={() => handleToggleSort('plan')} 
                      className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Plan
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="px-6 py-4 w-1/6">
                    <button 
                      onClick={() => handleToggleSort('tokens')} 
                      className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Tokens
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  </th>
                  <th className="px-6 py-4 w-1/6">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-slate-400">
                      <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary mb-3" />
                      <p className="text-xs uppercase tracking-wider font-bold">Loading users...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-slate-400 italic">
                      No users match the search filters.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-55/20 transition-colors">
                      
                      {/* Name & Job Title */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-slate-900 text-base">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-slate-450 shrink-0" />
                            {user.jobTitle || 'No Title Specified'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 font-mono font-bold flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Joined {new Date(user.createdAt).toLocaleDateString()} {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>

                      {/* Contact & Location */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-xs">
                          <div className="text-slate-700 flex items-center gap-1.5 font-semibold">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              {user.phone}
                            </div>
                          )}
                          {user.location && (
                            <div className="text-slate-500 flex items-center gap-1.5 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Plan status */}
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          user.plan === 'PRO' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {user.plan}
                        </span>
                      </td>

                      {/* Tokens count */}
                      <td className="px-6 py-4 font-mono font-bold text-amber-600">
                        {user.tokens.toFixed(1)}
                      </td>

                      {/* Ban Status */}
                      <td className="px-6 py-4">
                        {user.isBanned ? (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-xs font-bold">
                              <AlertOctagon className="w-3.5 h-3.5" />
                              Banned
                            </span>
                            {user.bannedUntil && (
                              <div className="text-[10px] text-red-500/70 mt-1 font-bold">
                                Exp: {new Date(user.bannedUntil).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-xs font-bold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="px-3.5 py-2.5 bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary font-bold rounded-full transition-all cursor-pointer shadow-sm active:scale-95 text-xs"
                          title="Manage User"
                        >
                          Manage
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!loading && totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs text-slate-500 font-bold">
                Showing {users.length} of {totalUsersCount} users
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-full disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-700 font-mono px-3">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-full disabled:opacity-40 disabled:pointer-events-none cursor-pointer shadow-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </section>

      </main>

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Create New User
              </h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">First Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.firstName}
                    onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={createForm.lastName}
                    onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase block">Password *</label>
                <input
                  type="password"
                  required
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase block">Job Title</label>
                <input
                  type="text"
                  value={createForm.jobTitle}
                  onChange={(e) => setCreateForm({ ...createForm, jobTitle: e.target.value })}
                  placeholder="e.g. Software Engineer"
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Initial Plan</label>
                  <select
                    value={createForm.plan}
                    onChange={(e) => setCreateForm({ ...createForm, plan: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900 cursor-pointer font-bold"
                  >
                    <option value="FREE">FREE</option>
                    <option value="PRO">PRO</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase block">Initial Tokens</label>
                  <input
                    type="number"
                    value={createForm.tokens}
                    onChange={(e) => setCreateForm({ ...createForm, tokens: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-full text-xs font-bold transition-all shadow-md shadow-primary/20 cursor-pointer active:scale-95 hover:brightness-110"
                >
                  Create User
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT / MANAGE USER DETAILS MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                Manage User: {selectedUser.firstName} {selectedUser.lastName}
              </h2>
              <button 
                onClick={() => setShowEditModal(false)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              
              {/* Edit Details Form */}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary pb-1 border-b border-slate-200">User Credentials & Bio</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">First Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.firstName}
                      onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Last Name</label>
                    <input
                      type="text"
                      required
                      value={editForm.lastName}
                      onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Email Address</label>
                    <input
                      type="email"
                      required
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Phone Number</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Job Title</label>
                    <input
                      type="text"
                      value={editForm.jobTitle}
                      onChange={(e) => setEditForm({ ...editForm, jobTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500">Location</label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500">Biography</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-50/50 border border-slate-250 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-full text-xs font-bold transition-all shadow-sm active:scale-95 hover:brightness-110"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Info Changes
                </button>
              </form>

              {/* Upgrades, Token, and Ban Controls Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                
                {/* Upgrade Plan Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    Manage Premium Plan
                  </h4>
                  <div className="flex gap-2">
                    <select
                      value={planInput}
                      onChange={(e) => setPlanInput(e.target.value as 'FREE' | 'PRO')}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none text-slate-900 cursor-pointer font-bold"
                    >
                      <option value="FREE">FREE</option>
                      <option value="PRO">PRO</option>
                    </select>
                    <button
                      onClick={handleUpdatePlan}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      Save Plan
                    </button>
                  </div>
                </div>

                {/* Tokens Adjust Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    Manage Tokens Account
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none text-slate-900 font-mono"
                    />
                    <button
                      onClick={handleUpdateTokens}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      Save Tokens
                    </button>
                  </div>
                </div>

              </div>

              {/* Ban / Suspension controls */}
              <div className="p-5 bg-red-50/50 border border-red-100 rounded-xl space-y-4 pt-4 border-t border-slate-200 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-650 flex items-center gap-1">
                  <Ban className="w-4 h-4" />
                  Account Security / Ban Configuration
                </h4>

                {selectedUser.isBanned ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                      <p className="font-bold">Account is currently Banned.</p>
                      {selectedUser.bannedUntil ? (
                        <p className="mt-1">Suspended until: <strong>{new Date(selectedUser.bannedUntil).toLocaleString()}</strong></p>
                      ) : (
                        <p className="mt-1">Suspended: <strong>Permanently</strong></p>
                      )}
                      {selectedUser.banReason && (
                        <p className="mt-1">Reason: <em>{selectedUser.banReason}</em></p>
                      )}
                    </div>
                    <button
                      onClick={() => handleBanToggle(false)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm active:scale-95"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Lift Account Ban (Unban)
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">Ban Duration (Days)</label>
                        <input
                          type="number"
                          placeholder="e.g. 7 (Leave empty for permanent)"
                          value={banDaysInput}
                          onChange={(e) => setBanDaysInput(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none text-slate-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 block">Reason for Ban</label>
                        <input
                          type="text"
                          placeholder="Violation of terms of service"
                          value={banReasonInput}
                          onChange={(e) => setBanReasonInput(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none text-slate-900"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleBanToggle(true)}
                      className="px-5 py-2.5 bg-red-650 hover:bg-red-500 text-white rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-red-600/10 active:scale-95"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Apply Account Ban (Suspend)
                    </button>
                  </div>
                )}

              </div>

            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Close Panel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
