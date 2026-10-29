import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { MatchBadge } from '../components/MatchBadge';
import { Search, MapPin, DollarSign, Building2, Filter, Bookmark, Check, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Toast } from '../components/Toast';

export const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { role, isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState(searchParams.get('jobType') || '');
  const [experienceFilter, setExperienceFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchParams.get('search')) params.search = searchParams.get('search');
      if (searchParams.get('location')) params.location = searchParams.get('location');
      if (searchParams.get('jobType')) params.jobType = searchParams.get('jobType');
      if (searchParams.get('experienceLevel')) params.experienceLevel = searchParams.get('experienceLevel');

      const res = await api.get('/jobs', { params });
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (search) params.search = search;
    if (locationFilter) params.location = locationFilter;
    if (jobTypeFilter) params.jobType = jobTypeFilter;
    if (experienceFilter) params.experienceLevel = experienceFilter;
    setSearchParams(params);
  };

  const handleToggleSaveJob = async (jobId, isCurrentlySaved) => {
    if (!isAuthenticated || role !== 'ROLE_STUDENT') {
      setToast({ message: 'Please sign in as a student to save jobs.', type: 'info' });
      return;
    }

    try {
      if (isCurrentlySaved) {
        await api.delete(`/jobs/${jobId}/save`);
        setToast({ message: 'Job removed from saved list', type: 'info' });
      } else {
        await api.post(`/jobs/${jobId}/save`);
        setToast({ message: 'Job saved successfully!', type: 'success' });
      }
      fetchJobs();
    } catch (err) {
      console.error('Failed to update saved job status', err);
    }
  };

  return (
    <div className="space-y-8 py-4 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Browse Opportunities</h1>
        <p className="text-sm text-slate-400">Discover full-time jobs, internships, and remote roles matched to your skillset.</p>
      </div>

      {/* FILTER BAR */}
      <form onSubmit={handleFilterSubmit} className="glass-card p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, tech stack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9"
            />
          </div>

          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Location (e.g. San Francisco)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="form-input pl-9"
            />
          </div>

          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All Employment Types</option>
            <option value="FULL_TIME">Full-Time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="PART_TIME">Part-Time</option>
            <option value="CONTRACT">Contract</option>
          </select>

          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All Experience Levels</option>
            <option value="FRESHER">Fresher / Graduate</option>
            <option value="JUNIOR">Junior (1-2 yrs)</option>
            <option value="MID">Mid Level (3-5 yrs)</option>
            <option value="SENIOR">Senior (5+ yrs)</option>
          </select>

        </div>

        <div className="flex justify-end gap-2 border-t border-slate-800 pt-3">
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setLocationFilter('');
              setJobTypeFilter('');
              setExperienceFilter('');
              setSearchParams({});
            }}
            className="btn btn-secondary btn-sm"
          >
            Reset Filters
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            <Filter size={14} /> Filter Results
          </button>
        </div>
      </form>

      {/* JOBS LISTING GRID */}
      {loading ? (
        <div className="grid-2">
          {[1, 2, 4].map((n) => (
            <div key={n} className="glass-card h-44 animate-pulse bg-slate-800/40"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-card text-center py-16 space-y-3">
          <p className="text-lg font-bold text-slate-300">No opportunities found matching your criteria</p>
          <p className="text-xs text-slate-500">Try adjusting your keyword search or location filters.</p>
        </div>
      ) : (
        <div className="grid-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="glass-card flex flex-col justify-between space-y-4 hover:border-indigo-500/50 transition-all">
              
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-primary">{job.jobType}</span>
                    {job.remote && <span className="badge badge-success">Remote</span>}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MatchBadge percentage={job.matchPercentage} />
                    {role === 'ROLE_STUDENT' && (
                      <button
                        onClick={() => handleToggleSaveJob(job.id, job.saved)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          job.saved
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
                        }`}
                        title={job.saved ? 'Remove Bookmark' : 'Bookmark Job'}
                      >
                        <Bookmark size={15} className={job.saved ? 'fill-current' : ''} />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-white hover:text-indigo-400 transition-colors">
                    <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                  </h2>
                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-1">
                    <Building2 size={13} className="text-indigo-400" /> {job.company?.name || 'Company'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center gap-1"><MapPin size={13} /> {job.location || 'Remote'}</span>
                  <span className="flex items-center gap-1"><DollarSign size={13} /> {job.salaryRange || 'Competitive'}</span>
                  <span className="badge badge-warning text-[10px]">{job.experienceLevel}</span>
                </div>
              </div>

              {/* Skills and Action */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills?.map((skill) => (
                    <span key={skill.id} className="skill-tag">{skill.name}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                  <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm">
                    View & Apply <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
