import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { MatchBadge } from '../components/MatchBadge';
import {
  Search, Briefcase, Building2, Users, CheckCircle,
  ArrowRight, MapPin, DollarSign, GraduationCap, ChevronRight
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFeaturedJobs(); }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const res = await api.get('/jobs');
      setFeaturedJobs(res.data.slice(0, 6));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(searchQuery.trim() ? `/jobs?search=${encodeURIComponent(searchQuery)}` : '/jobs');
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>

      {/* HERO */}
      <section style={{
        background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 60%, #f0fdfa 100%)',
        borderBottom: '1px solid #e2e8f0',
        padding: '4rem 1.5rem 3.5rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.35rem 1rem', borderRadius: '999px',
            background: '#eef2ff', border: '1px solid #c7d2fe',
            color: '#4f46e5', fontSize: '0.8rem', fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            🚀 Next-Generation Career & Internship Portal
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800,
            color: '#0f172a', lineHeight: 1.2, marginBottom: '1.1rem',
            letterSpacing: '-0.03em'
          }}>
            Find Your Dream Job.<br />
            <span style={{ color: '#4f46e5' }}>Match Skills. Get Hired.</span>
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#64748b', marginBottom: '2rem', lineHeight: 1.7 }}>
            NextHire connects job seekers with top companies using smart skill-matching.
            Apply in seconds, track your status in real time.
          </p>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '560px', margin: '0 auto' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
              <input
                type="text"
                placeholder="Job title, skill, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem',
                  border: '1.5px solid #e2e8f0', borderRadius: '10px',
                  fontSize: '0.95rem', color: '#0f172a', background: '#fff',
                  outline: 'none', transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#4f46e5'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '10px' }}>
              Search
            </button>
          </form>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem', marginTop: '1.75rem' }}>
            {[
              ['✓ Verified Companies', '#059669'],
              ['✓ Real-time Status Updates', '#4f46e5'],
              ['✓ Skill Match Scoring', '#7c3aed']
            ].map(([text, color]) => (
              <span key={text} style={{ fontSize: '0.82rem', fontWeight: 600, color }}>{text}</span>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* STATS */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', margin: '2.5rem 0' }}>
          {[
            { icon: <Briefcase size={22} color="#4f46e5" />, value: '500+', label: 'Active Jobs', bg: '#eef2ff' },
            { icon: <Building2 size={22} color="#7c3aed" />, value: '120+', label: 'Companies', bg: '#f5f3ff' },
            { icon: <Users size={22} color="#0891b2" />, value: '2,500+', label: 'Candidates', bg: '#ecfeff' },
            { icon: <CheckCircle size={22} color="#059669" />, value: '98%', label: 'Match Accuracy', bg: '#ecfdf5' },
          ].map(({ icon, value, label, bg }) => (
            <div key={label} style={{
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px',
              padding: '1.5rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem'
              }}>
                {icon}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{value}</div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </section>

        {/* FEATURED JOBS */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>Featured Opportunities</h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '0.2rem' }}>Handpicked jobs matched to your skills</p>
            </div>
            <Link to="/jobs" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid-3">
              {[1, 2, 3].map(n => (
                <div key={n} style={{
                  background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px',
                  height: '180px', animation: 'pulse 1.5s ease-in-out infinite'
                }} />
              ))}
            </div>
          ) : featuredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <Briefcase size={40} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
              <p>No jobs posted yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid-3">
              {featuredJobs.map((job) => (
                <div key={job.id} style={{
                  background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px',
                  padding: '1.5rem', display: 'flex', flexDirection: 'column',
                  gap: '1rem', transition: 'box-shadow 0.2s, border-color 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <span className="badge badge-primary">{job.jobType}</span>
                      <MatchBadge percentage={job.matchPercentage} />
                    </div>
                    <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem', lineHeight: 1.3 }}>
                        {job.title}
                      </h3>
                    </Link>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={13} color="#4f46e5" /> {job.company?.name || 'Company'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={12} /> {job.location || 'Remote'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <DollarSign size={12} /> {job.salaryRange || 'Competitive'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {job.requiredSkills?.slice(0, 3).map((skill) => (
                      <span key={skill.id} className="skill-tag">{skill.name}</span>
                    ))}
                    {job.requiredSkills?.length > 3 && (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', alignSelf: 'center' }}>+{job.requiredSkills.length - 3}</span>
                    )}
                  </div>

                  <Link to={`/jobs/${job.id}`} className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', justifyContent: 'center' }}>
                    View & Apply <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* HOW IT WORKS */}
        <section style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px',
          padding: '2.5rem', marginBottom: '2rem'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a' }}>How NextHire Works</h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.4rem' }}>
              A simple platform for job seekers, recruiters, and admins
            </p>
          </div>

          <div className="grid-3">
            {[
              {
                icon: <GraduationCap size={24} color="#4f46e5" />,
                bg: '#eef2ff',
                title: 'For Job Seekers',
                desc: 'Build your profile, add skills, and apply to matching jobs. Track every application step in real time.'
              },
              {
                icon: <Building2 size={24} color="#7c3aed" />,
                bg: '#f5f3ff',
                title: 'For Recruiters',
                desc: 'Post jobs with required skills, browse candidates, review resumes, and update screening stages easily.'
              },
              {
                icon: <CheckCircle size={24} color="#059669" />,
                bg: '#ecfdf5',
                title: 'For Admins',
                desc: 'Monitor platform stats, manage all users and companies, and keep job listings clean and compliant.'
              }
            ].map(({ icon, bg, title, desc }) => (
              <div key={title} style={{
                padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '14px',
                background: '#fafafa'
              }}>
                <div style={{
                  width: '46px', height: '46px', borderRadius: '12px', background: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                }}>
                  {icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem', color: '#0f172a' }}>{title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
