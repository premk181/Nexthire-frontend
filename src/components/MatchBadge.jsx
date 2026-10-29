import React from 'react';
import { Sparkles } from 'lucide-react';

export const MatchBadge = ({ percentage }) => {
  if (percentage === null || percentage === undefined) return null;

  let colorClasses = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
  if (percentage >= 80) {
    colorClasses = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10 shadow-lg';
  } else if (percentage >= 50) {
    colorClasses = 'bg-amber-500/15 text-amber-400 border-amber-500/40';
  } else {
    colorClasses = 'bg-slate-800 text-slate-400 border-slate-700';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${colorClasses}`}>
      <Sparkles size={13} className="animate-pulse" />
      <span>{percentage}% Skill Match</span>
    </div>
  );
};
