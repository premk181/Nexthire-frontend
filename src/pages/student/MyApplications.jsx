import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Toast } from '../../components/Toast';
import { MatchBadge } from '../../components/MatchBadge';
import { FileText, Building2, Calendar, Trash2, CheckCircle2, ChevronRight, ExternalLink } from 'lucide-react';

export const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      const res = await api.get('/applications/my');
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      await api.delete(`/applications/${appId}`);
      setApplications(applications.filter(a => a.id !== appId));
      setToast({ message: 'Application withdrawn successfully', type: 'info' });
    } catch (err) {
      console.error('Failed to withdraw application:', err);
    }
  };

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'APPLIED': return 0;
      case 'UNDER_REVIEW': return 1;
      case 'SHORTLISTED': return 2;
      case 'INTERVIEW': return 3;
      case 'SELECTED': return 4;
      case 'REJECTED': return -1;
      default: return 0;
    }
  };

  const steps = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

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
          <FileText size={28} className="text-indigo-400" /> Application Tracker
        </h1>
        <p className="text-sm text-slate-400">Track real-time candidate screening status and recruiter feedback.</p>
      </div>

      {applications.length === 0 ? (
        <div className="glass-card text-center py-16 space-y-3">
          <p className="text-slate-300 font-bold">No applications submitted yet</p>
          <p className="text-xs text-slate-500">Explore opportunities and submit your profile to get hired.</p>
          <Link to="/jobs" className="btn btn-primary btn-sm inline-flex mt-2">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const currentStep = getStatusStepIndex(app.status);
            const isRejected = app.status === 'REJECTED';

            return (
              <div key={app.id} className="glass-card space-y-6 border-slate-800 hover:border-slate-700 transition-all">
                
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="badge badge-primary">{app.job?.jobType}</span>
                      <MatchBadge percentage={app.matchPercentage} />
                    </div>
                    <h2 className="text-xl font-bold text-white hover:text-indigo-400 transition-colors">
                      <Link to={`/jobs/${app.job?.id}`}>{app.job?.title}</Link>
                    </h2>
                    <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                      <Building2 size={13} className="text-indigo-400" /> {app.job?.company?.name} • Applied on {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm text-xs">
                        Resume Link <ExternalLink size={12} />
                      </a>
                    )}
                    {app.status === 'APPLIED' && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        className="btn btn-danger btn-sm text-xs"
                      >
                        Withdraw <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* VISUAL STEPPER TIMELINE */}
                {isRejected ? (
                  <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-xl text-center text-xs text-rose-300 font-semibold">
                    Application Status: Rejected by Recruiter
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 gap-1 relative text-center">
                      {steps.map((stepName, idx) => {
                        const isCompleted = idx <= currentStep;
                        return (
                          <div key={stepName} className="flex flex-col items-center gap-2 relative z-10">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                              isCompleted 
                                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-500/30' 
                                : 'bg-slate-900 text-slate-600 border-slate-800'
                            }`}>
                              {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                            </div>
                            <span className={`text-[11px] font-semibold ${isCompleted ? 'text-indigo-300' : 'text-slate-600'}`}>
                              {stepName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recruiter Notes */}
                {app.notes && (
                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-indigo-400">Recruiter Feedback: </span> {app.notes}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
