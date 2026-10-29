import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Toast } from '../../components/Toast';
import { Briefcase, Users, Edit3, Trash2, PlusCircle, ExternalLink } from 'lucide-react';

export const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/recruiter/my');
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? All associated candidate applications will be removed.')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(j => j.id !== jobId));
      setToast({ message: 'Job posting deleted', type: 'info' });
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Briefcase size={28} className="text-purple-400" /> Posted Opportunities
          </h1>
          <p className="text-sm text-slate-400">Manage your active job postings and candidate pipelines.</p>
        </div>
        <Link to="/recruiter/post-job" className="btn btn-primary btn-sm">
          <PlusCircle size={15} /> Post New Opportunity
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="glass-card text-center py-16 space-y-3">
          <p className="text-slate-300 font-bold">No opportunities posted yet</p>
          <p className="text-xs text-slate-500">Create a job or internship posting to start receiving applicants.</p>
          <Link to="/recruiter/post-job" className="btn btn-primary btn-sm inline-flex mt-2">
            Post First Opportunity
          </Link>
        </div>
      ) : (
        <div className="glass-card divide-y divide-slate-800 p-0 overflow-hidden">
          {jobs.map((job) => (
            <div key={job.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-primary">{job.jobType}</span>
                  <span className="badge badge-success">{job.status}</span>
                </div>
                <h3 className="font-bold text-lg text-white">{job.title}</h3>
                <p className="text-xs text-slate-400">
                  {job.location || 'Remote'} • Salary: {job.salaryRange || 'Competitive'} • Posted {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/recruiter/applicants/${job.id}`} className="btn btn-primary btn-sm text-xs">
                  <Users size={14} /> View Applicants
                </Link>
                <Link to={`/recruiter/edit-job/${job.id}`} className="btn btn-secondary btn-sm text-xs" title="Edit Posting">
                  <Edit3 size={14} />
                </Link>
                <button onClick={() => handleDeleteJob(job.id)} className="btn btn-danger btn-sm text-xs" title="Delete Posting">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
