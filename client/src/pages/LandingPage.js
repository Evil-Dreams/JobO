import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Card, Stack, keyframes } from '@mui/material';
import {
  TrendingUp,
  Psychology,
  ArrowForward,
  CheckCircle,
  Analytics,
  AutoAwesome,
  RocketLaunch,
  WorkspacePremium,
} from '@mui/icons-material';

// Keyframe animations
const pulse = keyframes`
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.05); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 1200, applications: 5400, interviews: 890 });

  useEffect(() => {
    const stored = localStorage.getItem('jobo_stats');
    if (stored) {
      const parsed = JSON.parse(stored);
      const newStats = {
        users: parsed.users + 1,
        applications: parsed.applications + 3,
        interviews: parsed.interviews + 1,
      };
      setStats(newStats);
      localStorage.setItem('jobo_stats', JSON.stringify(newStats));
    } else {
      localStorage.setItem('jobo_stats', JSON.stringify(stats));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const features = [
    {
      icon: <Analytics sx={{ fontSize: 32 }} />,
      title: 'Resume Analyzer',
      desc: 'AI-powered resume scoring with detailed improvement suggestions',
      color: '#06b6d4',
    },
    {
      icon: <AutoAwesome sx={{ fontSize: 32 }} />,
      title: 'Cover Letter AI',
      desc: 'Generate personalized cover letters in seconds',
      color: '#14b8a6',
    },
    {
      icon: <Psychology sx={{ fontSize: 32 }} />,
      title: 'Interview Coach',
      desc: 'Practice with AI-generated questions and get instant feedback',
      color: '#10b981',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      title: 'Success Predictor',
      desc: 'Analyze your job match probability with AI',
      color: '#8b5cf6',
    },
  ];

  // Animated background orb component
  const GlowingOrb = ({ size, color, top, left, right, bottom, delay = 0 }) => (
    <Box
      sx={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        filter: 'blur(60px)',
        top,
        left,
        right,
        bottom,
        animation: `${pulse} 4s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        pointerEvents: 'none',
      }}
    />
  );

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Animated Background Orbs */}
      <GlowingOrb size={600} color="#06b6d4" top="-200px" right="-100px" delay={0} />
      <GlowingOrb size={500} color="#14b8a6" bottom="100px" left="-150px" delay={1} />
      <GlowingOrb size={400} color="#8b5cf6" top="50%" right="20%" delay={2} />
      
      {/* Navbar */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(2, 6, 23, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          zIndex: 100,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
                }}
              >
                J
              </Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 800, 
                background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em' 
              }}>
                JobO
              </Typography>
            </Box>
            <Stack direction="row" spacing={2}>
              <Button 
                variant="text" 
                onClick={() => navigate('/login')}
                sx={{ color: '#94a3b8', fontWeight: 600, '&:hover': { color: '#22d3ee' } }}
              >
                Sign In
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/register')}
                sx={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #22d3ee 0%, #2dd4bf 100%)',
                    boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
                  },
                }}
              >
                Get Started
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ 
        pt: 20, 
        pb: 16, 
        position: 'relative',
        zIndex: 1,
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ animation: `${float} 6s ease-in-out infinite` }}>
                <RocketLaunch sx={{ fontSize: 48, color: '#06b6d4', mb: 2, filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))' }} />
              </Box>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 900,
                  color: '#f8fafc',
                  mb: 3,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                }}
              >
                Land Your Dream Job{' '}
                <Box 
                  component="span" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Faster
                </Box>
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: '1.125rem', color: '#94a3b8', mb: 5, lineHeight: 1.8 }}
              >
                Track applications, manage resumes, generate AI cover letters, and prepare for
                interviews — all in one powerful platform.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/register')}
                  sx={{ 
                    px: 5, 
                    py: 1.75, 
                    fontSize: '1rem', 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #22d3ee 0%, #2dd4bf 100%)',
                      boxShadow: '0 0 40px rgba(6, 182, 212, 0.5)',
                      transform: 'translateY(-2px) scale(1.02)',
                    },
                  }}
                >
                  Start Free
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    px: 5, 
                    py: 1.75, 
                    fontSize: '1rem', 
                    fontWeight: 700,
                    borderColor: 'rgba(148, 163, 184, 0.3)',
                    color: '#f8fafc',
                    '&:hover': {
                      borderColor: '#06b6d4',
                      bgcolor: 'rgba(6, 182, 212, 0.1)',
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 4,
                  p: 5,
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  boxShadow: '0 0 50px rgba(6, 182, 212, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Gradient glow inside card */}
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 200,
                  height: 200,
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <Grid container spacing={4}>
                  {[
                    { label: 'Active Users', value: stats.users.toLocaleString(), color: '#06b6d4' },
                    { label: 'Applications', value: stats.applications.toLocaleString(), color: '#14b8a6' },
                    { label: 'Interviews', value: stats.interviews.toLocaleString(), color: '#10b981' },
                    { label: 'Success Rate', value: '67%', color: '#8b5cf6' },
                  ].map((stat) => (
                    <Grid item xs={6} key={stat.label}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h3" sx={{ 
                          fontWeight: 800, 
                          color: stat.color, 
                          mb: 1, 
                          lineHeight: 1,
                          textShadow: `0 0 20px ${stat.color}40`,
                        }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: 16, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, mb: 2, color: '#f8fafc' }}
            >
              Everything You Need
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: '#94a3b8', fontSize: '1.125rem', maxWidth: 650, mx: 'auto', lineHeight: 1.7 }}
            >
              Powerful AI tools to streamline your job search and maximize your chances of success
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    textAlign: 'center',
                    background: 'rgba(30, 41, 59, 0.5)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(148, 163, 184, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px -10px ${feature.color}30`,
                      borderColor: `${feature.color}50`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 4,
                      background: `${feature.color}15`,
                      color: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: `0 0 30px ${feature.color}20`,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700, color: '#f8fafc' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.7 }}>
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits */}
      <Box sx={{ py: 10, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 4, color: '#f8fafc' }}>
                Why Choose JobO?
              </Typography>
              <Stack spacing={3}>
                {[
                  'Centralized tracking for all your applications',
                  'AI-powered tools to save hours of work',
                  'Smart insights to improve your success rate',
                  'Beautiful dark interface that\'s easy on the eyes',
                  '100% free - no premium tiers',
                ].map((benefit) => (
                  <Box key={benefit} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: '#e2e8f0' }}>{benefit}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                p: 5, 
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(20, 184, 166, 0.1) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
                <WorkspacePremium sx={{ fontSize: 48, color: '#06b6d4', mb: 2 }} />
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#f8fafc' }}>
                  Ready to get started?
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, color: '#94a3b8' }}>
                  Join thousands of job seekers who are landing their dream jobs with JobO.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    '&:hover': { 
                      background: 'linear-gradient(135deg, #22d3ee 0%, #2dd4bf 100%)',
                      boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
                    },
                  }}
                >
                  Create Free Account
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, borderTop: '1px solid rgba(148, 163, 184, 0.1)', position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              © 2026 JobO. All rights reserved.
            </Typography>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              JobO
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
