import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase, User, LogOut, Bookmark, FileText,
  PlusCircle, ShieldCheck, Building2, Users, LayoutDashboard, Menu, X, ChevronDown
} from 'lucide-react';

export const Navbar = () => {
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors px-1 py-0.5 ${
      isActive(path)
        ? 'text-indigo-600 border-b-2 border-indigo-600'
        : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Briefcase size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Next<span style={{ color: '#4f46e5' }}>Hire</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex" style={{ gap: '2rem', alignItems: 'center' }}>
            <Link to="/" className={navLinkClass('/')}>Home</Link>
            <Link to="/jobs" className={navLinkClass('/jobs')}>Browse Jobs</Link>
            <Link to="/about" className={navLinkClass('/about')}>About</Link>
            <Link to="/contact" className={navLinkClass('/contact')}>Contact</Link>
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.4rem 0.75rem', borderRadius: '10px',
                    border: '1.5px solid #e2e8f0', background: '#f8fafc',
                    cursor: 'pointer', transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#a5b4fc'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: '#eef2ff', color: '#4f46e5',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem'
                  }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.3 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4f46e5' }}>
                      {role === 'ROLE_ADMIN' ? 'Admin' : role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Student'}
                    </div>
                  </div>
                  <ChevronDown size={14} color="#94a3b8" />
                </button>

                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                      width: '220px', background: '#fff',
                      border: '1px solid #e2e8f0', borderRadius: '14px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '0.5rem 0', zIndex: 50
                    }}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div style={{ padding: '0.6rem 1rem 0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                      <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '2px' }}>Signed in as</p>
                      <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{user?.email}</p>
                    </div>

                    {role === 'ROLE_STUDENT' && <>
                      <DropItem to="/student/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" close={() => setDropdownOpen(false)} />
                      <DropItem to="/student/profile" icon={<User size={15} />} label="My Profile" close={() => setDropdownOpen(false)} />
                      <DropItem to="/student/saved" icon={<Bookmark size={15} />} label="Saved Jobs" close={() => setDropdownOpen(false)} />
                      <DropItem to="/student/applications" icon={<FileText size={15} />} label="My Applications" close={() => setDropdownOpen(false)} />
                    </>}

                    {role === 'ROLE_RECRUITER' && <>
                      <DropItem to="/recruiter/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" close={() => setDropdownOpen(false)} />
                      <DropItem to="/recruiter/post-job" icon={<PlusCircle size={15} />} label="Post a Job" close={() => setDropdownOpen(false)} />
                      <DropItem to="/recruiter/manage-jobs" icon={<Briefcase size={15} />} label="Manage Jobs" close={() => setDropdownOpen(false)} />
                      <DropItem to="/recruiter/company" icon={<Building2 size={15} />} label="Company Profile" close={() => setDropdownOpen(false)} />
                    </>}

                    {role === 'ROLE_ADMIN' && <>
                      <DropItem to="/admin/dashboard" icon={<ShieldCheck size={15} />} label="Dashboard" close={() => setDropdownOpen(false)} />
                      <DropItem to="/admin/users" icon={<Users size={15} />} label="Manage Users" close={() => setDropdownOpen(false)} />
                      <DropItem to="/admin/companies" icon={<Building2 size={15} />} label="Companies" close={() => setDropdownOpen(false)} />
                    </>}

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.4rem' }} />
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                        padding: '0.6rem 1rem', fontSize: '0.875rem', color: '#ef4444',
                        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
                      }}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="flex md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '1rem 1.5rem' }}>
          {[['/', 'Home'], ['/jobs', 'Browse Jobs'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: 'block', padding: '0.6rem 0', fontSize: '0.95rem', color: '#374151', borderBottom: '1px solid #f1f5f9' }}
            >
              {label}
            </Link>
          ))}
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn btn-danger w-full">Sign Out</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const DropItem = ({ to, icon, label, close }) => (
  <Link
    to={to}
    onClick={close}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.6rem 1rem', fontSize: '0.875rem', color: '#374151',
      transition: 'background 0.15s'
    }}
    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <span style={{ color: '#6366f1' }}>{icon}</span>
    {label}
  </Link>
);
