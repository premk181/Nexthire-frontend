import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} className="text-emerald-400" />;
      case 'error': return <AlertCircle size={18} className="text-rose-400" />;
      default: return <Info size={18} className="text-indigo-400" />;
    }
  };

  const getBgClass = () => {
    switch (type) {
      case 'success': return 'border-emerald-500/30 bg-emerald-950/80 text-emerald-200';
      case 'error': return 'border-rose-500/30 bg-rose-950/80 text-rose-200';
      default: return 'border-indigo-500/30 bg-indigo-950/80 text-indigo-200';
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl transition-all animate-fade-in ${getBgClass()}`}>
      {getIcon()}
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button onClick={onClose} className="p-1 hover:opacity-75 transition-opacity">
          <X size={14} />
        </button>
      )}
    </div>
  );
};
