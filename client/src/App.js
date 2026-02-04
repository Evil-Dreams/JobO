import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard';
import ApplicationsList from './pages/ApplicationsList';
import Analytics from './pages/Analytics';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import AddApplication from './pages/AddApplication';
import ApplicationDetail from './pages/ApplicationDetail';
import Resumes from './pages/Resumes';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CoverLetters from './pages/CoverLetters';
import InterviewPrep from './pages/InterviewPrep';
import SuccessAnalyzer from './pages/SuccessAnalyzer';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { MainLayout } from './components/MainLayout';
import theme from './theme';

function AppContent() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Update active tab based on route
  React.useEffect(() => {
    const path = location.pathname;
    if (path.includes('/dashboard')) setActiveTab('dashboard');
    else if (path.includes('/applications')) setActiveTab('applications');
    else if (path.includes('/analytics')) setActiveTab('analytics');
    else if (path.includes('/documents')) setActiveTab('documents');
    else if (path.includes('/profile')) setActiveTab('profile');
    else if (path.includes('/settings')) setActiveTab('settings');
  }, [location]);

  const LayoutWrapper = ({ children }) => {
    const noLayoutRoutes = ['/', '/login', '/register'];
    const shouldShowLayout = isAuthenticated && !noLayoutRoutes.includes(location.pathname);

    if (shouldShowLayout) {
      return (
        <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
          {children}
        </MainLayout>
      );
    }
    return <>{children}</>;
  };

  return (
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/register" 
          element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/complete-profile" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><CompleteProfile /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><Dashboard /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><ApplicationsList /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/analytics" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><Analytics /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/documents" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><Documents /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><Profile /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><Settings /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/add" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><AddApplication /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applications/:id" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><ApplicationDetail /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resumes" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><Resumes /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/resume-analyzer" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><ResumeAnalyzer /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cover-letters" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><CoverLetters /></LayoutWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/interview-prep" 
          element={
            <ProtectedRoute>
              <LayoutWrapper><InterviewPrep /></LayoutWrapper>
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
          path="*" 
          element={<Navigate to="/" replace />}
        />
      </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
