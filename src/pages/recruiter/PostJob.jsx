import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Toast } from '../../components/Toast';
import { Briefcase, Sparkles, PlusCircle, Save } from 'lucide-react';

export const PostJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    jobType: 'FULL_TIME',
    location: '',
    isRemote: false,
    experienceLevel: 'FRESHER',
    salaryRange: '',
    deadline: '',
    skillIds: []
  });

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      const skillRes = await api.get('/skills');
      setAllSkills(skillRes.data);

      if (id) {
        const jobRes = await api.get(`/jobs/${id}`);
        const j = jobRes.data;
        setFormData({
          title: j.title || '',
          description: j.description || '',
          requirements: j.requirements || '',
          jobType: j.jobType || 'FULL_TIME',
          location: j.location || '',
          isRemote: j.isRemote || false,
          experienceLevel: j.experienceLevel || 'FRESHER',
          salaryRange: j.salaryRange || '',
          deadline: j.deadline || '',
          skillIds: j.requiredSkills ? j.requiredSkills.map(s => s.id) : []
        });
      }
    } catch (err) {
      console.error('Failed to load job edit details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSkill = (skillId) => {
    const current = [...formData.skillIds];
    if (current.includes(skillId)) {
      setFormData({ ...formData, skillIds: current.filter(sId => sId !== skillId) });
    } else {
      setFormData({ ...formData, skillIds: [...current, skillId] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (id) {
        await api.put(`/jobs/${id}`, formData);
        setToast({ message: 'Opportunity updated successfully!', type: 'success' });
      } else {
        await api.post('/jobs', formData);
        setToast({ message: 'Opportunity posted successfully!', type: 'success' });
      }
      setTimeout(() => navigate('/recruiter/manage-jobs'), 600);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to post opportunity.';
      setToast({ message: msg, type: 'error' });
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
          <PlusCircle size={28} className="text-purple-400" /> {id ? 'Edit Opportunity' : 'Post Job / Internship'}
        </h1>
        <p className="text-sm text-slate-400">Fill in details and required tech stack to reach matched candidates.</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card space-y-6">
        
        <div className="form-group">
          <label className="form-label">Job Title / Role Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Junior Full-Stack Developer / Frontend Intern"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="form-input"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select
              value={formData.jobType}
              onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
              className="form-select"
            >
              <option value="FULL_TIME">Full-Time Job</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="PART_TIME">Part-Time Job</option>
              <option value="CONTRACT">Contract Basis</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Experience Level</label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              className="form-select"
            >
              <option value="FRESHER">Fresher / Graduate</option>
              <option value="JUNIOR">Junior (1-2 yrs)</option>
              <option value="MID">Mid Level (3-5 yrs)</option>
              <option value="SENIOR">Senior (5+ yrs)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              placeholder="San Francisco, CA or Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Salary / Stipend Range</label>
            <input
              type="text"
              placeholder="$80k - $100k / year or $20/hr"
              value={formData.salaryRange}
              onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
              className="form-input"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isRemoteCheck"
            checked={formData.isRemote}
            onChange={(e) => setFormData({ ...formData, isRemote: e.target.checked })}
            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
          />
          <label htmlFor="isRemoteCheck" className="text-sm font-semibold text-slate-200 cursor-pointer">
            This is a 100% Remote position
          </label>
        </div>

        <div className="form-group">
          <label className="form-label">Job Description</label>
          <textarea
            rows="5"
            required
            placeholder="Describe team culture, daily responsibilities, and impact..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="form-textarea"
          ></textarea>
        </div>

        <div className="form-group">
          <label className="form-label">Requirements & Qualifications</label>
          <textarea
            rows="4"
            placeholder="Degree requirements, core competencies, and project experience..."
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="form-textarea"
          ></textarea>
        </div>

        {/* SKILLS TAGGER */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="form-label flex items-center gap-1.5">
            <Sparkles size={16} className="text-purple-400" /> Select Required Tech Stack Skills
          </label>
          <p className="text-xs text-slate-400">Selected skills will be matched against candidate profiles to compute Match %.</p>

          <div className="flex flex-wrap gap-2 pt-2">
            {allSkills.map((skill) => {
              const isSelected = formData.skillIds.includes(skill.id);
              return (
                <button
                  type="button"
                  key={skill.id}
                  onClick={() => handleToggleSkill(skill.id)}
                  className={`skill-tag cursor-pointer transition-all ${
                    isSelected ? 'matched font-bold border-purple-500 bg-purple-500/20 text-purple-300' : 'hover:border-slate-600'
                  }`}
                >
                  {skill.name} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={saving} className="btn btn-primary px-8">
            <Save size={16} /> {saving ? 'Submitting...' : id ? 'Update Posting' : 'Publish Opportunity'}
          </button>
        </div>

      </form>
    </div>
  );
};
