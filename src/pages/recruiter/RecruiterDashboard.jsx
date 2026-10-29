import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, PlusCircle, Building2, ChevronRight, CheckCircle2 } from 'lucide-react';

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [recRes, jobRes] = await Promise.all([
        api.get('/recruiters/profile'),
        api.get('/jobs/recruiter/my')
      ]);
      setRecruiterProfile(recRes.data);
      setJobs(jobRes.data);
    } catch (err) {
      console.error('Failed to load recruiter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border-purple-500/30">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white">Recruiter Workspace 👋</h1>
          <p className="text-xs text-purple-300 font-medium">
            {recruiterProfile?.designation || 'Recruiter'} • {recruiterProfile?.company?.name || 'Set up company profile'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/recruiter/post-job" className="btn btn-primary btn-sm">
            <PlusCircle size={15} /> Post New Opportunity
          </Link>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/recruiter/manage-jobs" className="glass-card flex items-center justify-between hover:border-purple-500/50 transition-all">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Active Opportunities</span>
            <div className="text-2xl font-extrabold text-white">{jobs.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Briefcase size={20} />
          </div>
        </Link>

        <Link to="/recruiter/company" className="glass-card flex items-center justify-between hover:border-purple-500/50 transition-all">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Company Profile</span>
            <div className="text-sm font-extrabold text-white truncate max-w-[150px]">
              {recruiterProfile?.company?.name || 'Not Configured'}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <Building2 size={20} />
          </div>
        </Link>

        <div className="glass-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Verified Employer</span>
            <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <CheckCircle2 size={14} /> Active Listing Status
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>
      </div>

      {/* POSTED JOBS QUICK LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Briefcase size={18} className="text-purple-400" /> Your Posted Opportunities
          </h2>
          <Link to="/recruiter/manage-jobs" className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1">
            Manage All <ChevronRight size={14} />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="glass-card text-center py-12 space-y-3">
            <p className="text-slate-300 font-bold">No jobs posted yet</p>
            <p className="text-xs text-slate-500">Post a job or internship to start receiving matched candidate applications.</p>
            <Link to="/recruiter/post-job" className="btn btn-primary btn-sm inline-flex mt-2">
              Post First Job
            </Link>
          </div>
        ) : (
          <div className="grid-2">
            {jobs.map((job) => (
              <div key={job.id} className="glass-card space-y-3">
                <div className="flex items-start justify-between">
                  <span className="badge badge-primary">{job.jobType}</span>
                  <span className="badge badge-success">{job.status}</span>
                </div>

                <h3 className="font-bold text-slate-100 text-base">{job.title}</h3>
                <p className="text-xs text-slate-400">{job.location || 'Remote'} • {job.experienceLevel}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-xs text-slate-400">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  <Link to={`/recruiter/applicants/${job.id}`} className="btn btn-secondary btn-sm text-xs">
                    View Applicants <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
