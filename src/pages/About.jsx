import React from 'react';
import { ShieldCheck, Code, Server, Database, Layers, CheckCircle2 } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 animate-fade-in">
      
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-white">About <span className="text-indigo-400">NextHire</span></h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto">
          NextHire is a modern full-stack web application designed to connect student talent with recruiters and companies. Built with a robust layered architecture, secure authentication, and real-time candidate status tracking.
        </p>
      </div>

      <div className="glass-card space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Layers className="text-indigo-400" size={24} /> Architecture & System Design
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          The system follows strict separation of concerns across decoupled frontend, backend, and deployment repositories communicating over RESTful APIs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="font-bold text-indigo-400 flex items-center gap-2">
              <Server size={18} /> Spring Boot REST API (Backend)
            </h3>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Layered Controller → Service → Repository architecture</li>
              <li>• Spring Security with stateless JWT Authentication</li>
              <li>• Spring Data JPA & Hibernate ORM mapping</li>
              <li>• MySQL / H2 relational database with normalized schema</li>
              <li>• Centralized Exception Handler & Data Bean Validation</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h3 className="font-bold text-purple-400 flex items-center gap-2">
              <Code size={18} /> React & Vite (Frontend)
            </h3>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Component-driven React architecture with React Router v6</li>
              <li>• Axios HTTP client with Bearer Token request interceptors</li>
              <li>• Custom CSS Design System with dark/glassmorphic accents</li>
              <li>• Real-time Skill Match Percentage calculation engine</li>
              <li>• Role-Based Guarded Route Protection</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="glass-card space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="text-emerald-400" size={20} /> Production Quality Highlights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2"><CheckCircle2 className="text-emerald-400" size={16} /> BCrypt password hashing</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="text-emerald-400" size={16} /> Role-Based Access Control (Student, Recruiter, Admin)</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="text-emerald-400" size={16} /> Live Application Stepper Status Workflow</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="text-emerald-400" size={16} /> Skill-based Candidate Screening Engine</div>
        </div>
      </div>

    </div>
  );
};
