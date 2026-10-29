import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../../components/Toast';
import { 
  User, Sparkles, FileText, Globe, Code, 
  Save, Plus, X, GraduationCap, Briefcase
} from 'lucide-react';

export const StudentProfile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    headline: '',
    bio: '',
    resumeUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    educationJson: '',
    experienceJson: '',
    skillIds: []
  });

  useEffect(() => {
    fetchProfileAndSkills();
  }, []);

  const fetchProfileAndSkills = async () => {
    try {
      const [profRes, skillRes] = await Promise.all([
        api.get('/students/profile'),
        api.get('/skills')
      ]);

      setProfile(profRes.data);
      setAllSkills(skillRes.data);

      const p = profRes.data;
      setFormData({
        name: p.user?.name || '',
        phone: p.user?.phone || '',
        headline: p.headline || '',
        bio: p.bio || '',
        resumeUrl: p.resumeUrl || '',
        githubUrl: p.githubUrl || '',
        linkedinUrl: p.linkedinUrl || '',
        educationJson: p.educationJson || '',
        experienceJson: p.experienceJson || '',
        skillIds: p.skills ? p.skills.map(s => s.id) : []
      });
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSkill = (skillId) => {
    const current = [...formData.skillIds];
    if (current.includes(skillId)) {
      setFormData({ ...formData, skillIds: current.filter(id => id !== skillId) });
    } else {
      setFormData({ ...formData, skillIds: [...current, skillId] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/students/profile', formData);
      setProfile(res.data);
      await refreshUser();
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      console.error('Failed to update profile', err);
      setToast({ message: 'Failed to save changes.', type: 'error' });
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto space-y-8 py-4 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Student Profile</h1>
          <p className="text-sm text-slate-400">Manage your skills, resume, education, and candidate portfolio.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* PERSONAL INFO & HEADLINE */}
        <div className="glass-card space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <User size={18} className="text-indigo-400" /> Basic Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Headline</label>
            <input
              type="text"
              placeholder="e.g. Aspiring Full-Stack Software Engineer | Java & React Enthusiast"
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio / Summary</label>
            <textarea
              rows="3"
              placeholder="Briefly describe your background, interest, and core strengths..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="form-textarea"
            ></textarea>
          </div>
        </div>

        {/* SKILLS SELECTOR CHIPS */}
        <div className="glass-card space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sparkles size={18} className="text-indigo-400" /> Skills Tagger (Used for Job Skill Matching)
          </h2>
          <p className="text-xs text-slate-400">
            Select all technologies you are proficient in. Jobs matching these skills will receive a higher Match % badge.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {allSkills.map((skill) => {
              const isSelected = formData.skillIds.includes(skill.id);
              return (
                <button
                  type="button"
                  key={skill.id}
                  onClick={() => handleToggleSkill(skill.id)}
                  className={`skill-tag cursor-pointer transition-all ${
                    isSelected ? 'matched font-bold ring-2 ring-emerald-500/40' : 'hover:border-slate-600'
                  }`}
                >
                  {skill.name} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* RESUME & PORTFOLIO LINKS */}
        <div className="glass-card space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText size={18} className="text-indigo-400" /> Resume & Social Links
          </h2>

          <div className="form-group">
            <label className="form-label">Resume Link (Google Drive / Dropbox PDF)</label>
            <input
              type="url"
              placeholder="https://drive.google.com/file/d/..."
              value={formData.resumeUrl}
              onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">LinkedIn URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn btn-primary px-8">
            <Save size={16} /> {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>

      </form>
    </div>
  );
};
