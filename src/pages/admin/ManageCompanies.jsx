import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building2, Globe, MapPin, CheckCircle2 } from 'lucide-react';

export const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get('/admin/companies');
      setCompanies(res.data);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 animate-fade-in">
      <div className="space-y-1 border-b border-slate-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Building2 size={28} className="text-cyan-400" /> Registered Companies
        </h1>
        <p className="text-sm text-slate-400">Directory of verified employer organizations participating on NextHire.</p>
      </div>

      <div className="grid-2 gap-4">
        {companies.map((c) => (
          <div key={c.id} className="glass-card space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-lg text-white">{c.name}</h3>
              <span className="badge badge-success flex items-center gap-1">
                <CheckCircle2 size={12} /> Verified
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{c.description || 'No description provided.'}</p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1"><MapPin size={13} /> {c.location || 'Remote'}</span>
              <span>{c.companySize || 'Size N/A'}</span>
              {c.website && (
                <a href={c.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1">
                  <Globe size={13} /> Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
