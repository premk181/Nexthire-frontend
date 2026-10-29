import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MatchBadge } from '../components/MatchBadge';
import { Toast } from '../components/Toast';
import { 
  Building2, MapPin, DollarSign, Calendar, Briefcase, 
  Send, Bookmark, ArrowLeft, CheckCircle, Sparkles, X, Globe, Users
} from 'lucide-react';

export const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, isAuthenticated, user } = useAuth();

  const [job, setJob] = useState(null);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    if (isAuthenticated && role === 'ROLE_STUDENT') {
      fetchStudentProfile();
      checkExistingApplication();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data);
    } catch (err) {
      console.error('Failed to fetch job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentProfile = async () => {
    try {
      const res = await api.get('/students/profile');
      setStudentProfile(res.data);
      if (res.data.resumeUrl) setResumeUrl(res.data.resumeUrl);
    } catch (err) {
      console.error('Failed to fetch student profile:', err);
    }
  };

  const checkExistingApplication = async () => {
    try {
      const res = await api.get('/applications/my');
      const existing = res.data.find(app => app.job.id === parseInt(id));
      if (existing) setHasApplied(true);
    } catch (err) {
      console.error('Failed to check existing application status', err);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/applications', {
        jobId: parseInt(id),
        resumeUrl,
        coverLetter
      });
      setHasApplied(true);
      setApplyModalOpen(false);
      setToast({ message: 'Application submitted successfully!', type: 'success' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit application';
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="glass-card text-center py-16 space-y-4">
        <p className="text-lg text-slate-300">Job posting not found or has been removed.</p>
        <Link to="/jobs" className="btn btn-primary btn-sm">Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm text-slate-400">
        <ArrowLeft size={14} /> Back
      </button>

      {/* HEADER CARD */}
      <div className="glass-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge badge-primary">{job.jobType}</span>
              {job.remote && <span className="badge badge-success">Remote</span>}
              <MatchBadge percentage={job.matchPercentage} />
            </div>
            <h1 className="text-3xl font-extrabold text-white">{job.title}</h1>
            <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Building2 size={16} className="text-indigo-400" /> {job.company?.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {role === 'ROLE_STUDENT' && (
              hasApplied ? (
                <div className="btn bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default">
                  <CheckCircle size={16} /> Applied
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!isAuthenticated) navigate('/login');
                    else setApplyModalOpen(true);
                  }}
                  className="btn btn-primary"
                >
                  <Send size={16} /> Apply Now
                </button>
              )
            )}
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-slate-500 block">Location</span>
            <span className="font-bold text-slate-200 flex items-center gap-1 mt-0.5"><MapPin size={13} /> {job.location || 'Remote'}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Salary / Stipend</span>
            <span className="font-bold text-slate-200 flex items-center gap-1 mt-0.5"><DollarSign size={13} /> {job.salaryRange || 'Competitive'}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Experience Level</span>
            <span className="font-bold text-slate-200 flex items-center gap-1 mt-0.5"><Briefcase size={13} /> {job.experienceLevel}</span>
          </div>

          <div>
            <span className="text-slate-500 block">Application Deadline</span>
            <span className="font-bold text-slate-200 flex items-center gap-1 mt-0.5"><Calendar size={13} /> {job.deadline || 'Open'}</span>
          </div>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Job Description</h2>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{job.description}</p>
          </div>

          {job.requirements && (
            <div className="glass-card space-y-4">
              <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Requirements & Expectations</h2>
              <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">{job.requirements}</p>
            </div>
          )}

          <div className="glass-card space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" /> Required Skills & Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills?.map((skill) => {
                const isStudentSkill = studentProfile?.skills?.some(s => s.id === skill.id);
                return (
                  <span
                    key={skill.id}
                    className={`skill-tag py-1 px-3 ${isStudentSkill ? 'matched' : ''}`}
                  >
                    {skill.name} {isStudentSkill && '✓'}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Company Sidebar */}
        <div className="space-y-6">
          <div className="glass-card space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">About the Company</h3>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="font-bold text-sm text-indigo-300">{job.company?.name}</p>
              <p className="text-slate-400">{job.company?.description}</p>
              {job.company?.website && (
                <a href={job.company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-indigo-400 hover:underline pt-2">
                  <Globe size={13} /> {job.company.website}
                </a>
              )}
              {job.company?.companySize && (
                <div className="flex items-center gap-1 text-slate-400 pt-1">
                  <Users size={13} /> {job.company.companySize}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* APPLICATION MODAL */}
      {applyModalOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content space-y-4 relative">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-white">Apply for {job.title}</h2>
              <p className="text-xs text-slate-400">at {job.company?.name}</p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-4 pt-2">
              <div className="form-group">
                <label className="form-label">Resume URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/your-resume.pdf"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  className="form-input"
                />
                <span className="text-[11px] text-slate-500">Link your Google Drive, Dropbox, or hosted resume file</span>
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter / Note (Optional)</label>
                <textarea
                  rows="4"
                  placeholder="Introduce yourself and explain why you're a great fit for this position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary btn-sm">
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
