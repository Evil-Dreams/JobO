import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import LandingPage from './pages/LandingPage';
import ProfessionalLogin from './pages/ProfessionalLogin';
import Register from './pages/Register';
import CompleteProfile from './pages/CompleteProfile';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import ProfessionalApplications from './pages/ProfessionalApplications';
import AddApplication from './pages/AddApplication';
import ApplicationDetail from './pages/ApplicationDetail';
import Resumes from './pages/Resumes';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CoverLetters from './pages/CoverLetters';
import InterviewPrep from './pages/InterviewPrep';
import SuccessAnalyzer from './pages/SuccessAnalyzer';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import theme from './theme';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <ProfessionalLogin /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/complete-profile" 
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ProfessionalDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications" 
          element={
            <ProtectedRoute>
              <ProfessionalApplications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/add" 
          element={
            <ProtectedRoute>
              <AddApplication />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/:id" 
          element={
            <ProtectedRoute>
              <ApplicationDetail />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resumes" 
          element={
            <ProtectedRoute>
              <Resumes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resume-analyzer" 
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cover-letters" 
          element={
            <ProtectedRoute>
              <CoverLetters />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/interview-prep" 
          element={
            <ProtectedRoute>
              <InterviewPrep />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/success-analyzer" 
          element={
            <ProtectedRoute>
              <SuccessAnalyzer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="*" 
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
