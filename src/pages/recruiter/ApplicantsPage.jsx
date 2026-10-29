import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Toast } from '../../components/Toast';
import { MatchBadge } from '../../components/MatchBadge';
import { Users, FileText, ExternalLink, Edit3, ArrowLeft, X, Sparkles, User } from 'lucide-react';

export const ApplicantsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchJobAndApplicants();
  }, [jobId]);

  const fetchJobAndApplicants = async () => {
    try {
      const [jRes, appRes] = await Promise.all([
        api.get(`/jobs/${jobId}`),
        api.get(`/applications/job/${jobId}`)
      ]);
      setJob(jRes.data);
      setApplicants(appRes.data);
    } catch (err) {
      console.error('Failed to fetch applicants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setNotes(app.notes || '');
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.put(`/applications/${selectedApp.id}/status`, {
        status: newStatus,
        notes
      });
      setApplicants(applicants.map(a => a.id === selectedApp.id ? res.data : a));
      setSelectedApp(null);
      setToast({ message: 'Candidate status updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to update applicant status:', err);
      setToast({ message: 'Failed to update candidate status.', type: 'error' });
    } finally {
      setUpdating(false);
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
    <div className="max-w-5xl mx-auto space-y-6 py-4 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Link to="/recruiter/manage-jobs" className="btn btn-secondary btn-sm inline-flex">
        <ArrowLeft size={14} /> Back to Job Postings
      </Link>

      <div className="space-y-1 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Users size={28} className="text-purple-400" /> Applicant Pipeline
        </h1>
        <p className="text-sm text-slate-400">
          Screening candidates for <span className="text-indigo-400 font-bold">{job?.title}</span>
        </p>
      </div>

      {applicants.length === 0 ? (
        <div className="glass-card text-center py-16 space-y-2">
          <p className="text-slate-300 font-bold">No candidates have applied yet</p>
          <p className="text-xs text-slate-500">Share your job posting link to attract qualified applicants.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => {
            const student = app.studentProfile;
            const user = student?.user;

            return (
              <div key={app.id} className="glass-card space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-white">{user?.name}</h3>
                      <MatchBadge percentage={app.matchPercentage} />
                    </div>
                    <p className="text-xs text-indigo-300 font-medium">{student?.headline || 'Student / Candidate'}</p>
                    <p className="text-[11px] text-slate-500">{user?.email} • {user?.phone || 'No phone'}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`badge ${
                      app.status === 'SELECTED' ? 'badge-success' :
                      app.status === 'REJECTED' ? 'badge-danger' :
                      app.status === 'SHORTLISTED' ? 'badge-primary' : 'badge-warning'
                    }`}>
                      {app.status}
                    </span>

                    <button
                      onClick={() => handleOpenStatusModal(app)}
                      className="btn btn-primary btn-sm text-xs"
                    >
                      <Edit3 size={13} /> Update Status
                    </button>
                  </div>

                </div>

                {/* SKILLS MATCHED */}
                <div className="space-y-1">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Sparkles size={13} className="text-indigo-400" /> Candidate Skillset:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {student?.skills?.map(s => {
                      const isRequired = job?.requiredSkills?.some(rs => rs.id === s.id);
                      return (
                        <span key={s.id} className={`skill-tag text-[10px] ${isRequired ? 'matched font-bold' : ''}`}>
                          {s.name} {isRequired && '✓'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* COVER LETTER & RESUME */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <div className="truncate max-w-md">
                    <span className="text-slate-500 font-bold">Cover Letter: </span>
                    <span>{app.coverLetter || 'No cover letter provided.'}</span>
                  </div>

                  {app.resumeUrl && (
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary btn-sm text-xs shrink-0"
                    >
                      View Candidate Resume <ExternalLink size={12} />
                    </a>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* STATUS UPDATE MODAL */}
      {selectedApp && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content space-y-4 relative">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-white">Update Candidate Status</h2>
            <p className="text-xs text-slate-400">
              Candidate: <span className="text-white font-bold">{selectedApp.studentProfile?.user?.name}</span>
            </p>

            <form onSubmit={handleStatusSubmit} className="space-y-4 pt-2">
              <div className="form-group">
                <label className="form-label">Recruitment Stage</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-select"
                >
                  <option value="APPLIED">APPLIED (New Application)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Screening)</option>
                  <option value="SHORTLISTED">SHORTLISTED (Shortlisted)</option>
                  <option value="INTERVIEW">INTERVIEW (Interview Scheduled)</option>
                  <option value="SELECTED">SELECTED (Hired / Offer Extended)</option>
                  <option value="REJECTED">REJECTED (Not Selected)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Recruiter Feedback / Notes (Optional)</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Scheduled technical interview for Oct 15 at 10 AM..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn btn-primary btn-sm">
                  {updating ? 'Saving...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
