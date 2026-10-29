import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      background: '#fff', borderTop: '1px solid #e2e8f0',
      padding: '2.5rem 1.5rem', marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>
                Next<span style={{ color: '#4f46e5' }}>Hire</span>
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
              Connecting student talent with great companies nationwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['Find Jobs', '/jobs'], ['Internships', '/jobs?jobType=INTERNSHIP'], ['About', '/about'], ['Contact', '/contact']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} style={{ fontSize: '0.88rem', color: '#64748b', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = '#4f46e5'}
                    onMouseLeave={e => e.target.style.color = '#64748b'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Portals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['Student', '/register'], ['Recruiter', '/register'], ['Admin Login', '/login']].map(([label, to]) => (
                <li key={label}>
                  <Link to={to} style={{ fontSize: '0.88rem', color: '#64748b', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = '#4f46e5'}
                    onMouseLeave={e => e.target.style.color = '#64748b'}
                  >{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Built With
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {['Spring Boot', 'React', 'Vite', 'MySQL', 'JWT'].map(tech => (
                <span key={tech} style={{
                  fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.55rem',
                  borderRadius: '6px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0'
                }}>{tech}</span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            © {new Date().getFullYear()} NextHire. All rights reserved.
          </p>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with <Heart size={13} style={{ color: '#ef4444', fill: '#ef4444' }} /> as a portfolio project.
          </p>
        </div>
      </div>
    </footer>
  );
};
