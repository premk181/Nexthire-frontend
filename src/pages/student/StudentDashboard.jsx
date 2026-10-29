import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { MatchBadge } from '../../components/MatchBadge';
import { 
  FileText, Bookmark, Sparkles, User, Briefcase, 
  ChevronRight, Building2, MapPin
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profRes, appRes, savedRes, jobRes] = await Promise.all([
        api.get('/students/profile'),
        api.get('/applications/my'),
        api.get('/jobs/saved'),
        api.get('/jobs')
      ]);

      setProfile(profRes.data);
      setApplications(appRes.data);
      setSavedJobs(savedRes.data);

      // Filter recommended jobs with high match percentage
      const highMatchJobs = jobRes.data
        .filter(j => j.matchPercentage !== null && j.matchPercentage >= 50)
        .slice(0, 4);
      setRecommendedJobs(highMatchJobs);
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
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
      
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white">Welcome, {user?.name}! 👋</h1>
          <p className="text-xs text-indigo-300 font-medium">
            {profile?.headline || 'Student / Candidate'}
          </p>
        </div>
        <Link to="/student/profile" className="btn btn-primary btn-sm self-start sm:self-auto">
          <User size={14} /> Edit Profile & Skills
        </Link>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/student/applications" className="glass-card flex items-center justify-between hover:border-indigo-500/50 transition-all">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Submitted Applications</span>
            <div className="text-2xl font-extrabold text-white">{applications.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <FileText size={20} />
          </div>
        </Link>

        <Link to="/student/saved" className="glass-card flex items-center justify-between hover:border-indigo-500/50 transition-all">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Saved Bookmarks</span>
            <div className="text-2xl font-extrabold text-white">{savedJobs.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Bookmark size={20} />
          </div>
        </Link>

        <div className="glass-card flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Skills Added</span>
            <div className="text-2xl font-extrabold text-white">{profile?.skills?.length || 0}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
        </div>
      </div>

      {/* RECOMMENDED JOBS BY SKILL MATCH */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles size={18} className="text-indigo-400" /> Recommended For You
          </h2>
          <Link to="/jobs" className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1">
            View All <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid-2">
          {recommendedJobs.map((job) => (
            <div key={job.id} className="glass-card space-y-3">
              <div className="flex items-start justify-between">
                <span className="badge badge-primary">{job.jobType}</span>
                <MatchBadge percentage={job.matchPercentage} />
              </div>

              <div>
                <h3 className="font-bold text-slate-100 text-base hover:text-indigo-400 transition-colors">
                  <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <Building2 size={13} className="text-indigo-400" /> {job.company?.name} • <MapPin size={12} /> {job.location || 'Remote'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills?.slice(0, 2).map((s) => (
                    <span key={s.id} className="skill-tag text-[10px]">{s.name}</span>
                  ))}
                </div>
                <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm text-xs">
                  Apply <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RECENT APPLICATIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText size={18} className="text-indigo-400" /> Recent Applications
          </h2>
          <Link to="/student/applications" className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1">
            Track All <ChevronRight size={14} />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="glass-card text-center py-8 text-xs text-slate-400">
            You haven't submitted any job applications yet.{' '}
            <Link to="/jobs" className="text-indigo-400 font-semibold hover:underline">Browse jobs now</Link>
          </div>
        ) : (
          <div className="glass-card divide-y divide-slate-800 p-0 overflow-hidden">
            {applications.slice(0, 3).map((app) => (
              <div key={app.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
                <div>
                  <h4 className="font-bold text-sm text-slate-100">{app.job?.title}</h4>
                  <p className="text-xs text-slate-400">{app.job?.company?.name} • Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span className={`badge ${
                  app.status === 'SELECTED' ? 'badge-success' :
                  app.status === 'REJECTED' ? 'badge-danger' :
                  app.status === 'SHORTLISTED' ? 'badge-primary' : 'badge-warning'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
