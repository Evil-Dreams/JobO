import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Stack,
} from '@mui/material';
import {
  WorkOutline,
  Description,
  Article,
  Psychology,
  Add,
  ArrowForward,
  Schedule,
  CheckCircle,
  TrendingUp,
  Analytics,
  AutoAwesome,
} from '@mui/icons-material';
import { getApplications } from '../store/applicationsSlice';
import ProfessionalLayout from '../components/ProfessionalLayout';

const ProfessionalDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applications, isLoading } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getApplications());
  }, [dispatch]);

  const stats = applications.reduce(
    (acc, app) => {
      acc.total++;
      const status = app.status?.toLowerCase() || 'applied';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { total: 0, applied: 0, interview: 0, rejected: 0, offer: 0 }
  );

  const responseRate = stats.total > 0 ? Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0;
  const recentApplications = applications.slice(0, 5);

  const getStatusStyle = (status) => {
    const styles = {
      Applied: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
      Interview: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
      Offer: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
      Rejected: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
    };
    return styles[status] || styles.Applied;
  };

  const quickActions = [
    { title: 'Applications', icon: <WorkOutline />, path: '/applications', count: stats.total },
    { title: 'Resumes', icon: <Description />, path: '/resumes', count: 2 },
    { title: 'Cover Letters', icon: <Article />, path: '/cover-letters', count: null, badge: 'AI' },
    { title: 'Interview Prep', icon: <Psychology />, path: '/interview-prep', count: null, badge: 'AI' },
  ];

  const aiTools = [
    { 
      title: 'Resume Analyzer', 
      desc: 'Get AI-powered scoring and suggestions for your resume',
      icon: <Analytics />, 
      path: '/resume-analyzer', 
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      glow: 'rgba(6, 182, 212, 0.3)',
    },
    { 
      title: 'Success Probability', 
      desc: 'Analyze your chances for any job application',
      icon: <TrendingUp />, 
      path: '/success-analyzer', 
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      glow: 'rgba(16, 185, 129, 0.3)',
    },
    { 
      title: 'Cover Letter AI', 
      desc: 'Generate personalized cover letters instantly',
      icon: <Article />, 
      path: '/cover-letters', 
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      glow: 'rgba(139, 92, 246, 0.3)',
    },
    { 
      title: 'Interview Coach', 
      desc: 'Practice with AI-generated interview questions',
      icon: <Psychology />, 
      path: '/interview-prep', 
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      glow: 'rgba(245, 158, 11, 0.3)',
    },
  ];

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 3, md: 5 }, minHeight: '100vh' }}>
        <Container maxWidth="xl" disableGutters>
          {/* Header */}
          <Box sx={{ mb: 5 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                color: '#f8fafc', 
                mb: 1,
                letterSpacing: '-0.02em',
              }}
            >
              Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.0625rem' }}>
              Here's what's happening with your job search.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {[
              { label: 'Total Applications', value: stats.total, icon: <WorkOutline />, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.2)' },
              { label: 'Interviews', value: stats.interview, icon: <Schedule />, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.2)' },
              { label: 'Offers', value: stats.offer, icon: <CheckCircle />, color: '#10b981', glow: 'rgba(16, 185, 129, 0.2)' },
              { label: 'Response Rate', value: `${responseRate}%`, icon: <TrendingUp />, color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.2)' },
            ].map((stat) => (
              <Grid item xs={6} md={3} key={stat.label}>
                <Card 
                  sx={{
                    height: '100%',
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 20px 40px -12px ${stat.glow}`,
                      border: `1px solid ${stat.color}40`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography 
                          variant="h3" 
                          sx={{ 
                            fontWeight: 800, 
                            color: '#f8fafc', 
                            mb: 1,
                            lineHeight: 1,
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          bgcolor: `${stat.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: stat.color,
                          fontSize: 28,
                          boxShadow: `0 0 20px ${stat.glow}`,
                        }}
                      >
                        {stat.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#f8fafc' }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                onClick={() => navigate('/applications/add')}
                sx={{
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  '&:hover': { 
                    transform: 'translateY(-4px)', 
                    boxShadow: '0 20px 40px -12px rgba(6, 182, 212, 0.5)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Add sx={{ fontSize: 28 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '1.0625rem' }}>
                    New Application
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            {quickActions.map((action) => (
              <Grid item xs={6} sm={6} md={2.25} key={action.title}>
                <Card
                  onClick={() => navigate(action.path)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-4px)', 
                      boxShadow: '0 20px 40px -12px rgba(6, 182, 212, 0.2)',
                      borderColor: 'rgba(6, 182, 212, 0.3)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box sx={{ color: '#06b6d4', mb: 1.5, fontSize: 28 }}>{action.icon}</Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: '#f8fafc' }}>
                      {action.title}
                    </Typography>
                    {action.count !== null && (
                      <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                        {action.count} items
                      </Typography>
                    )}
                    {action.badge && (
                      <Chip 
                        label={action.badge} 
                        size="small" 
                        sx={{ 
                          fontSize: '0.6rem', 
                          height: 18, 
                          background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)', 
                          color: '#fff',
                          fontWeight: 700,
                        }} 
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* AI Tools Section */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <AutoAwesome sx={{ color: '#06b6d4' }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                AI-Powered Tools
              </Typography>
              <Chip label="NEW" size="small" sx={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', fontWeight: 700 }} />
            </Box>
            <Grid container spacing={3}>
              {aiTools.map((tool) => (
                <Grid item xs={12} sm={6} md={3} key={tool.title}>
                  <Card
                    onClick={() => navigate(tool.path)}
                    sx={{
                      cursor: 'pointer',
                      height: '100%',
                      background: 'rgba(30, 41, 59, 0.5)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(148, 163, 184, 0.1)',
                      transition: 'all 0.3s ease',
                      overflow: 'visible',
                      '&:hover': { 
                        transform: 'translateY(-6px)', 
                        boxShadow: `0 20px 40px -12px ${tool.glow}`,
                        borderColor: `${tool.glow}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2.5,
                          background: tool.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          mb: 2.5,
                          fontSize: 24,
                          boxShadow: `0 0 20px ${tool.glow}`,
                        }}
                      >
                        {tool.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1rem', color: '#f8fafc' }}>
                        {tool.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.6 }}>
                        {tool.desc}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Main Content */}
          <Grid container spacing={4}>
            {/* Recent Applications */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 0 }}>
                  <Box
                    sx={{
                      p: 4,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                      Recent Applications
                    </Typography>
                    <Button 
                      size="small" 
                      endIcon={<ArrowForward />} 
                      onClick={() => navigate('/applications')}
                      sx={{ fontWeight: 600, color: '#06b6d4' }}
                    >
                      View All
                    </Button>
                  </Box>

                  {isLoading ? (
                    <Box sx={{ p: 4 }}>
                      <LinearProgress sx={{ borderRadius: 2 }} />
                    </Box>
                  ) : recentApplications.length === 0 ? (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                      <WorkOutline sx={{ fontSize: 56, color: '#334155', mb: 2 }} />
                      <Typography variant="h6" sx={{ color: '#94a3b8', mb: 1, fontWeight: 600 }}>
                        No applications yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                        Start tracking your job applications
                      </Typography>
                      <Button 
                        variant="contained" 
                        startIcon={<Add />} 
                        onClick={() => navigate('/applications/add')}
                        sx={{
                          background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                          '&:hover': {
                            boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
                          },
                        }}
                      >
                        Add Application
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      {recentApplications.map((app) => {
                        const style = getStatusStyle(app.status);
                        return (
                          <Box
                            key={app._id}
                            onClick={() => navigate(`/applications/${app._id}`)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2.5,
                              p: 3,
                              borderBottom: '1px solid rgba(148, 163, 184, 0.05)',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              '&:hover': { 
                                bgcolor: 'rgba(6, 182, 212, 0.05)',
                                transform: 'translateX(4px)',
                              },
                              '&:last-child': { borderBottom: 'none' },
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                width: 48,
                                height: 48,
                                background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                                fontWeight: 700,
                                fontSize: '1.125rem',
                              }}
                            >
                              {app.company?.charAt(0)?.toUpperCase() || '?'}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.25, color: '#f8fafc' }} noWrap>
                                {app.position}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.9375rem' }} noWrap>
                                {app.company}
                              </Typography>
                            </Box>
                            <Chip
                              label={app.status || 'Applied'}
                              size="small"
                              sx={{ 
                                bgcolor: style.bg, 
                                color: style.color, 
                                fontWeight: 700,
                                borderRadius: 2,
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Status Breakdown */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 4, color: '#f8fafc' }}>
                    Status Breakdown
                  </Typography>

                  <Stack spacing={3.5}>
                    {[
                      { label: 'Applied', count: stats.applied, color: '#3b82f6' },
                      { label: 'Interview', count: stats.interview, color: '#f59e0b' },
                      { label: 'Offer', count: stats.offer, color: '#10b981' },
                      { label: 'Rejected', count: stats.rejected, color: '#ef4444' },
                    ].map((item) => (
                      <Box key={item.label}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
                            {item.label}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: item.color }}>
                            {item.count}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={stats.total ? (item.count / stats.total) * 100 : 0}
                          sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: 'rgba(148, 163, 184, 0.1)',
                            '& .MuiLinearProgress-bar': { 
                              bgcolor: item.color, 
                              borderRadius: 5,
                              transition: 'transform 0.4s ease',
                            },
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>

                  <Box
                    sx={{
                      mt: 5,
                      p: 4,
                      background: 'rgba(6, 182, 212, 0.1)',
                      borderRadius: 3,
                      textAlign: 'center',
                      border: '1px solid rgba(6, 182, 212, 0.2)',
                    }}
                  >
                    <Typography variant="h2" sx={{ 
                      fontWeight: 800, 
                      background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1, 
                      lineHeight: 1 
                    }}>
                      {responseRate}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                      Response Rate
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ProfessionalLayout>
  );
};

export default ProfessionalDashboard;
