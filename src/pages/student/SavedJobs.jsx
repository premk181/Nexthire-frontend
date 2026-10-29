import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { MatchBadge } from '../../components/MatchBadge';
import { Toast } from '../../components/Toast';
import { Bookmark, Building2, MapPin, DollarSign, ChevronRight, Trash2 } from 'lucide-react';

export const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get('/jobs/saved');
      setSavedJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch saved jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}/save`);
      setSavedJobs(savedJobs.filter(j => j.id !== jobId));
      setToast({ message: 'Job removed from bookmarks', type: 'info' });
    } catch (err) {
      console.error('Failed to unsave job:', err);
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
    <div className="space-y-6 py-4 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-1 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Bookmark size={28} className="text-indigo-400" /> Saved Bookmarks
        </h1>
        <p className="text-sm text-slate-400">Keep track of opportunities you plan to review or apply for later.</p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="glass-card text-center py-16 space-y-3">
          <p className="text-slate-300 font-bold">No saved jobs yet</p>
          <p className="text-xs text-slate-500">Bookmark jobs while browsing to save them here for quick access.</p>
          <Link to="/jobs" className="btn btn-primary btn-sm inline-flex mt-2">
            Browse Opportunities
          </Link>
        </div>
      ) : (
        <div className="grid-2 gap-4">
          {savedJobs.map((job) => (
            <div key={job.id} className="glass-card space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="badge badge-primary">{job.jobType}</span>
                  <div className="flex items-center gap-2">
                    <MatchBadge percentage={job.matchPercentage} />
                    <button
                      onClick={() => handleUnsave(job.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                      title="Remove Bookmark"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-lg text-white hover:text-indigo-400 transition-colors">
                  <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                </h3>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Building2 size={13} className="text-indigo-400" /> {job.company?.name}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin size={12} /> {job.location || 'Remote'}
                </span>
                <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm text-xs">
                  View & Apply <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
