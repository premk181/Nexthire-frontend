import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Toast } from '../../components/Toast';
import { Building2, Globe, MapPin, Users, Save, CheckCircle } from 'lucide-react';

export const CompanyProfile = () => {
  const [recruiterProfile, setRecruiterProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    logoUrl: '',
    companySize: '50-200 employees'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/recruiters/profile');
      setRecruiterProfile(res.data);
      if (res.data.company) {
        const c = res.data.company;
        setFormData({
          name: c.name || '',
          description: c.description || '',
          website: c.website || '',
          location: c.location || '',
          industry: c.industry || '',
          logoUrl: c.logoUrl || '',
          companySize: c.companySize || '50-200 employees'
        });
      }
    } catch (err) {
      console.error('Failed to fetch recruiter profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (recruiterProfile?.company?.id) {
        await api.put(`/companies/${recruiterProfile.company.id}`, formData);
      } else {
        await api.post('/companies', formData);
      }
      setToast({ message: 'Company profile updated successfully!', type: 'success' });
      fetchProfile();
    } catch (err) {
      console.error('Failed to save company profile', err);
      setToast({ message: 'Failed to update company details.', type: 'error' });
    } finally {
      setSaving(false);
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
    <div className="max-w-3xl mx-auto space-y-8 py-4 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-1 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Building2 size={28} className="text-purple-400" /> Company Profile
        </h1>
        <p className="text-sm text-slate-400">Configure company details shown on your job postings.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-6">
        
        <div className="form-group">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            required
            placeholder="TechCorp Solutions"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Company Description</label>
          <textarea
            rows="4"
            required
            placeholder="Describe your company mission, industry focus, and work culture..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-textarea"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Website URL</label>
            <input
              type="url"
              placeholder="https://company.example.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Headquarters Location</label>
            <input
              type="text"
              placeholder="San Francisco, CA"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Industry</label>
            <input
              type="text"
              placeholder="Software & Technology"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Size</label>
            <select
              value={formData.companySize}
              onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
              className="form-select"
            >
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="50-200 employees">50-200 employees</option>
              <option value="200-500 employees">200-500 employees</option>
              <option value="500+ employees">500+ employees</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Company Logo URL (Optional)</label>
          <input
            type="url"
            placeholder="https://example.com/logo.png"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={saving} className="btn btn-primary px-8">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Company Details'}
          </button>
        </div>

      </form>
    </div>
  );
};
