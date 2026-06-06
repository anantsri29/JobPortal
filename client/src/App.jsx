import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/Shared/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import CandidateDashboard from './pages/CandidateDashboard';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ProfilePage from './pages/ProfilePage';
import RecruiterSetupPage from './pages/RecruiterSetupPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PostJobPage from './pages/PostJobPage';
import RecruiterJobsPage from './pages/RecruiterJobsPage';
import ApplicantsPage from './pages/ApplicantsPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                padding: '12px 16px',
                fontWeight: '500',
              },
              className: '!bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-white !shadow-lg !border !border-slate-200 dark:!border-slate-700',
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />

            <Route path="/onboarding" element={
              <ProtectedRoute roles={['candidate']}>
                <OnboardingPage />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute roles={['candidate']}>
                <CandidateDashboard />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute roles={['candidate']}>
                <ApplicationsPage />
              </ProtectedRoute>
            } />

            <Route path="/recruiter/setup" element={
              <ProtectedRoute roles={['recruiter']}>
                <RecruiterSetupPage />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/dashboard" element={
              <ProtectedRoute roles={['recruiter']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/post-job" element={
              <ProtectedRoute roles={['recruiter']}>
                <PostJobPage />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/edit-job/:id" element={
              <ProtectedRoute roles={['recruiter']}>
                <PostJobPage />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/jobs" element={
              <ProtectedRoute roles={['recruiter']}>
                <RecruiterJobsPage />
              </ProtectedRoute>
            } />
            <Route path="/recruiter/jobs/:jobId/applicants" element={
              <ProtectedRoute roles={['recruiter']}>
                <ApplicantsPage />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
