import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Toast } from '../../components/Toast';
import { Users, Search, CheckCircle, XCircle } from 'lucide-react';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filterRole, setFilterRole] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentEnabled) => {
    try {
      const res = await api.put(`/admin/users/${userId}/status`, { enabled: !currentEnabled });
      setUsers(users.map(u => u.id === userId ? res.data : u));
      setToast({ message: `User status changed to ${!currentEnabled ? 'Enabled' : 'Disabled'}`, type: 'info' });
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = !filterRole || u.role === filterRole;
    const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-1 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Users size={28} className="text-cyan-400" /> User Management
        </h1>
        <p className="text-sm text-slate-400">View and manage candidate, recruiter, and administrator user accounts.</p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-9"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="form-select sm:w-48"
        >
          <option value="">All Roles</option>
          <option value="ROLE_STUDENT">Student Candidates</option>
          <option value="ROLE_RECRUITER">Recruiters</option>
          <option value="ROLE_ADMIN">Administrators</option>
        </select>
      </div>

      {/* USER TABLE */}
      <div className="glass-card p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white">{u.name}</div>
                  <div className="text-slate-400 text-[11px]">{u.email}</div>
                </td>
                <td className="p-4">
                  <span className={`badge ${
                    u.role === 'ROLE_ADMIN' ? 'badge-danger' :
                    u.role === 'ROLE_RECRUITER' ? 'badge-primary' : 'badge-success'
                  }`}>
                    {u.role.replace('ROLE_', '')}
                  </span>
                </td>
                <td className="p-4 text-slate-400">{u.phone || 'N/A'}</td>
                <td className="p-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  {u.enabled ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle size={14} /> Active
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1">
                      <XCircle size={14} /> Disabled
                    </span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {u.role !== 'ROLE_ADMIN' && (
                    <button
                      onClick={() => handleToggleStatus(u.id, u.enabled)}
                      className={`btn btn-sm text-[11px] ${u.enabled ? 'btn-danger' : 'btn-secondary'}`}
                    >
                      {u.enabled ? 'Disable Account' : 'Enable Account'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
