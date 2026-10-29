import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Toast } from '../../components/Toast';
import { Briefcase, Trash2, Building2, MapPin } from 'lucide-react';

export const ManageJobsAdmin = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/admin/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to moderate and delete this job posting?')) return;
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
      setToast({ message: 'Job posting deleted by administrator', type: 'info' });
    } catch (err) {
      console.error('Failed to delete job:', err);
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
    <div className="space-y-6 py-4 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-1 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Briefcase size={28} className="text-cyan-400" /> Job Content Moderation
        </h1>
        <p className="text-sm text-slate-400">Review all active and historical job listings across the platform.</p>
      </div>

      <div className="glass-card p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="p-4">Title & Company</th>
              <th className="p-4">Type</th>
              <th className="p-4">Recruiter</th>
              <th className="p-4">Posted Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {jobs.map((j) => (
              <tr key={j.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white">{j.title}</div>
                  <div className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Building2 size={12} className="text-indigo-400" /> {j.company?.name} • <MapPin size={11} /> {j.location || 'Remote'}
                  </div>
                </td>
                <td className="p-4">
                  <span className="badge badge-primary">{j.jobType}</span>
                </td>
                <td className="p-4 text-slate-300">{j.recruiterName || 'Recruiter'}</td>
                <td className="p-4 text-slate-400">{new Date(j.createdAt).toLocaleDateString()}</td>
                <td className="p-4">
                  <span className="badge badge-success">{j.status}</span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDeleteJob(j.id)}
                    className="btn btn-danger btn-sm text-xs"
                    title="Delete non-compliant posting"
                  >
                    Moderate <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
