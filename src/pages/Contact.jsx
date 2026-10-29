import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import { Toast } from '../components/Toast';

export const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [toast, setToast] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({ message: 'Thank you for reaching out! Our team will respond shortly.', type: 'success' });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white">Contact <span className="text-indigo-400">Support</span></h1>
        <p className="text-slate-400 text-base max-w-lg mx-auto">
          Have questions regarding NextHire platform features, academic demonstrations, or technical queries? Send us a message!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Info Column */}
        <div className="space-y-4">
          <div className="glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
              <Mail size={20} />
            </div>
            <h3 className="font-bold text-white text-sm">Email Us</h3>
            <p className="text-xs text-slate-400">support@nexthire.example.com</p>
          </div>

          <div className="glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
              <Phone size={20} />
            </div>
            <h3 className="font-bold text-white text-sm">Call Support</h3>
            <p className="text-xs text-slate-400">+1 (800) 555-NEXT</p>
          </div>

          <div className="glass-card space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <h3 className="font-bold text-white text-sm">Location</h3>
            <p className="text-xs text-slate-400">San Francisco, CA & Remote</p>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-2 glass-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare size={20} className="text-indigo-400" /> Send Message
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                required
                placeholder="Inquiry subject..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                rows="4"
                required
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="form-textarea"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Send Message <Send size={16} />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
