import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogIn, GraduationCap, UserCheck, ShieldCheck } from 'lucide-react';
import { Toast } from '../components/Toast';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        if (res.role === 'ROLE_ADMIN') navigate('/admin/dashboard');
        else if (res.role === 'ROLE_RECRUITER') navigate('/recruiter/dashboard');
        else navigate('/student/dashboard');
      }, 500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (e, p) => { setEmail(e); setPassword(p); };

  return (
    <div style={{
      minHeight: 'calc(100vh - 65px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '2rem 1rem',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)'
    }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{
        width: '100%', maxWidth: '420px',
        background: '#fff', border: '1px solid #e2e8f0',
        borderRadius: '20px', padding: '2.5rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: '#4f46e5', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 1rem'
          }}>
            <Briefcase size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.3rem' }}>Welcome back</h1>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Sign in to your NextHire account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email" required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <input
              type="password" required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', justifyContent: 'center' }}
          >
            {loading ? 'Signing in...' : 'Sign In'} <LogIn size={16} />
          </button>
        </form>

        {/* Demo Accounts */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', marginBottom: '0.75rem', fontWeight: 600 }}>
            Try a demo account
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: 'Student', email: 'student@nexthire.com', pass: 'student123', icon: <GraduationCap size={16} />, color: '#4f46e5', bg: '#eef2ff' },
              { label: 'Recruiter', email: 'recruiter@techcorp.com', pass: 'recruiter123', icon: <UserCheck size={16} />, color: '#7c3aed', bg: '#f5f3ff' },
              { label: 'Admin', email: 'admin@nexthire.com', pass: 'admin123', icon: <ShieldCheck size={16} />, color: '#0891b2', bg: '#ecfeff' },
            ].map(({ label, email: e, pass: p, icon, color, bg }) => (
              <button
                key={label}
                onClick={() => quickLogin(e, p)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                  padding: '0.65rem 0.5rem', borderRadius: '10px',
                  background: bg, border: `1px solid transparent`,
                  cursor: 'pointer', transition: 'all 0.15s', color
                }}
                onMouseEnter={ev => ev.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
                onMouseLeave={ev => ev.currentTarget.style.boxShadow = 'none'}
              >
                {icon}
                <span style={{ fontSize: '0.78rem', fontWeight: 600 }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#4f46e5', fontWeight: 600 }}>Register here</Link>
        </p>
      </div>
    </div>
  );
};
