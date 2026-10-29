import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoutes';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfile } from './pages/student/StudentProfile';
import { SavedJobs } from './pages/student/SavedJobs';
import { MyApplications } from './pages/student/MyApplications';

// Recruiter Pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { CompanyProfile } from './pages/recruiter/CompanyProfile';
import { PostJob } from './pages/recruiter/PostJob';
import { ManageJobs } from './pages/recruiter/ManageJobs';
import { ApplicantsPage } from './pages/recruiter/ApplicantsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageCompanies } from './pages/admin/ManageCompanies';
import { ManageJobsAdmin } from './pages/admin/ManageJobsAdmin';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes - Home/Login/Register manage their own layout */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* Pages with standard content padding */}
              <Route path="/about" element={<div className="main-content"><About /></div>} />
              <Route path="/contact" element={<div className="main-content"><Contact /></div>} />
              <Route path="/jobs" element={<div className="main-content"><JobsPage /></div>} />
              <Route path="/jobs/:id" element={<div className="main-content"><JobDetailPage /></div>} />

              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_STUDENT']} />}>
                <Route path="/student/dashboard" element={<div className="main-content"><StudentDashboard /></div>} />
                <Route path="/student/profile" element={<div className="main-content"><StudentProfile /></div>} />
                <Route path="/student/saved" element={<div className="main-content"><SavedJobs /></div>} />
                <Route path="/student/applications" element={<div className="main-content"><MyApplications /></div>} />
              </Route>

              {/* Recruiter Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_RECRUITER']} />}>
                <Route path="/recruiter/dashboard" element={<div className="main-content"><RecruiterDashboard /></div>} />
                <Route path="/recruiter/company" element={<div className="main-content"><CompanyProfile /></div>} />
                <Route path="/recruiter/post-job" element={<div className="main-content"><PostJob /></div>} />
                <Route path="/recruiter/edit-job/:id" element={<div className="main-content"><PostJob /></div>} />
                <Route path="/recruiter/manage-jobs" element={<div className="main-content"><ManageJobs /></div>} />
                <Route path="/recruiter/applicants/:jobId" element={<div className="main-content"><ApplicantsPage /></div>} />
              </Route>

              {/* Admin Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/admin/dashboard" element={<div className="main-content"><AdminDashboard /></div>} />
                <Route path="/admin/users" element={<div className="main-content"><ManageUsers /></div>} />
                <Route path="/admin/companies" element={<div className="main-content"><ManageCompanies /></div>} />
                <Route path="/admin/jobs" element={<div className="main-content"><ManageJobsAdmin /></div>} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
