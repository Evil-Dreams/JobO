import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../store/authSlice';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  keyframes,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, RocketLaunch } from '@mui/icons-material';

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
`;

const ProfessionalLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => dispatch(reset());
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
        py: 6,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Orbs */}
      <Box
        sx={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: `${pulse} 4s ease-in-out infinite`,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20, 184, 166, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: `${pulse} 4s ease-in-out infinite`,
          animationDelay: '1s',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: `${pulse} 4s ease-in-out infinite`,
          animationDelay: '2s',
        }}
      />
      
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: '1.5rem',
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 0 40px rgba(6, 182, 212, 0.6)',
                },
              }}
              onClick={() => navigate('/')}
            >
              J
            </Box>
            <Typography
              variant="h4"
              sx={{ 
                fontWeight: 900, 
                background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer', 
                letterSpacing: '-0.02em' 
              }}
              onClick={() => navigate('/')}
            >
              JobO
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ color: '#f8fafc', fontWeight: 700, mb: 1 }}>
            Welcome back!
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.0625rem' }}>
            Sign in to continue to your account.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: 4,
            p: 5,
            border: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 0 50px rgba(6, 182, 212, 0.1)',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3.5 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={() => setShowPassword(!showPassword)} 
                    edge="end"
                    sx={{ color: '#64748b', '&:hover': { color: '#22d3ee' } }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={isLoading}
            sx={{ 
              py: 1.75, 
              mb: 3, 
              fontSize: '1.0625rem', 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #22d3ee 0%, #2dd4bf 100%)',
                boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
              },
            }}
          >
            {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Sign In'}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>
            Don't have an account?{' '}
            <Link 
              to="/register" 
              style={{ 
                background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 700, 
                textDecoration: 'none' 
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{ 
            textAlign: 'center', 
            mt: 5, 
            color: '#64748b', 
            cursor: 'pointer', 
            fontWeight: 500,
            transition: 'color 0.2s ease',
            '&:hover': { color: '#22d3ee' },
          }}
          onClick={() => navigate('/')}
        >
          ← Back to home
        </Typography>
      </Container>
    </Box>
  );
};

export default ProfessionalLogin;
