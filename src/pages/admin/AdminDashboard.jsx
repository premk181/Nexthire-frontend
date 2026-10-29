import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { ShieldCheck, Users, Building2, Briefcase, FileText, ChevronRight } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border-cyan-500/30">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="text-cyan-400" size={26} /> Admin Command Center
          </h1>
          <p className="text-xs text-cyan-300 font-medium">Platform-wide statistics, user controls, and compliance moderation</p>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Link to="/admin/users" className="glass-card hover:border-cyan-500/50 transition-all space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Candidates</span>
          <div className="text-3xl font-extrabold text-white">{stats?.totalStudents || 0}</div>
        </Link>

        <Link to="/admin/users" className="glass-card hover:border-cyan-500/50 transition-all space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Recruiters</span>
          <div className="text-3xl font-extrabold text-white">{stats?.totalRecruiters || 0}</div>
        </Link>

        <Link to="/admin/companies" className="glass-card hover:border-cyan-500/50 transition-all space-y-1">
          <span className="text-xs text-slate-400 font-medium">Registered Companies</span>
          <div className="text-3xl font-extrabold text-white">{stats?.totalCompanies || 0}</div>
        </Link>

        <Link to="/admin/jobs" className="glass-card hover:border-cyan-500/50 transition-all space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Job Postings</span>
          <div className="text-3xl font-extrabold text-white">{stats?.totalJobs || 0}</div>
        </Link>

        <div className="glass-card space-y-1">
          <span className="text-xs text-slate-400 font-medium">Active Opportunities</span>
          <div className="text-3xl font-extrabold text-emerald-400">{stats?.activeJobs || 0}</div>
        </div>

        <div className="glass-card space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Applications Submitted</span>
          <div className="text-3xl font-extrabold text-indigo-400">{stats?.totalApplications || 0}</div>
        </div>
      </div>

      {/* QUICK ADMIN ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/users" className="glass-card p-5 space-y-3 hover:border-cyan-500/50 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
            <Users size={20} />
          </div>
          <h3 className="font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
            User Moderation <ChevronRight size={16} />
          </h3>
          <p className="text-xs text-slate-400">View user directory and toggle account active/disabled states.</p>
        </Link>

        <Link to="/admin/companies" className="glass-card p-5 space-y-3 hover:border-cyan-500/50 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <Building2 size={20} />
          </div>
          <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
            Company Directory <ChevronRight size={16} />
          </h3>
          <p className="text-xs text-slate-400">Inspect registered employer company profiles and credentials.</p>
        </Link>

        <Link to="/admin/jobs" className="glass-card p-5 space-y-3 hover:border-cyan-500/50 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Briefcase size={20} />
          </div>
          <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
            Job Content Moderation <ChevronRight size={16} />
          </h3>
          <p className="text-xs text-slate-400">Review platform postings and delete non-compliant content.</p>
        </Link>
      </div>

    </div>
  );
};
