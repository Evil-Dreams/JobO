import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Chip,
  Alert,
} from '@mui/material';
import {
  Person,
  Work,
  School,
  ArrowForward,
  ArrowBack,
  Check,
  Home,
} from '@mui/icons-material';
import { updateProfile } from '../store/userSlice';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    headline: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    currentRole: '',
    experience: '',
    skills: [],
    education: '',
    desiredRole: '',
    desiredSalary: '',
  });

  const [skillInput, setSkillInput] = useState('');

  const steps = [
    { label: 'Basic Info', icon: <Person /> },
    { label: 'Experience', icon: <Work /> },
    { label: 'Skills & Education', icon: <School /> },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Professional Headline"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer | Full Stack Developer"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Portfolio Website"
                name="portfolio"
                value={formData.portfolio}
                onChange={handleChange}
                placeholder="https://..."
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Current/Most Recent Role"
                name="currentRole"
                value={formData.currentRole}
                onChange={handleChange}
                placeholder="e.g., Software Engineer at Google"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 5"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Desired Role"
                name="desiredRole"
                value={formData.desiredRole}
                onChange={handleChange}
                placeholder="e.g., Senior Software Engineer"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Desired Salary Range"
                name="desiredSalary"
                value={formData.desiredSalary}
                onChange={handleChange}
                placeholder="e.g., $120,000 - $150,000"
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Skills"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type a skill and press Enter"
                helperText="Press Enter to add each skill"
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {formData.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    sx={{ 
                      bgcolor: 'rgba(6, 182, 212, 0.15)', 
                      color: '#22d3ee',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                    }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                placeholder="e.g., BS Computer Science, Stanford University"
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        {/* Back to Home Button */}
        <Button
          startIcon={<Home />}
          onClick={() => navigate('/')}
          sx={{
            mb: 3,
            color: '#94a3b8',
            '&:hover': {
              color: '#22d3ee',
              bgcolor: 'rgba(6, 182, 212, 0.1)',
            },
          }}
        >
          Back to Home
        </Button>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1 }}>
            Complete Your Profile
          </Typography>
          <Typography variant="body1" sx={{ color: '#94a3b8' }}>
            Help us personalize your experience
          </Typography>
        </Box>

        {/* Stepper */}
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel 
          sx={{ 
            mb: 5,
            '& .MuiStepLabel-label': { color: '#94a3b8' },
            '& .MuiStepLabel-label.Mui-active': { color: '#22d3ee' },
            '& .MuiStepLabel-label.Mui-completed': { color: '#14b8a6' },
            '& .MuiStepIcon-root': { color: 'rgba(148, 163, 184, 0.3)' },
            '& .MuiStepIcon-root.Mui-active': { color: '#06b6d4' },
            '& .MuiStepIcon-root.Mui-completed': { color: '#14b8a6' },
          }}
        >
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form Card */}
        <Card sx={{
          background: 'rgba(30, 41, 59, 0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
        }}>
          <CardContent sx={{ p: 5 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {renderStepContent(activeStep)}

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
              <Button
                variant="outlined"
                onClick={activeStep === 0 ? handleSkip : handleBack}
                startIcon={activeStep === 0 ? null : <ArrowBack />}
                sx={{
                  borderColor: 'rgba(148, 163, 184, 0.3)',
                  color: '#94a3b8',
                  '&:hover': {
                    borderColor: 'rgba(148, 163, 184, 0.5)',
                    bgcolor: 'rgba(148, 163, 184, 0.1)',
                  },
                }}
              >
                {activeStep === 0 ? 'Skip for Now' : 'Back'}
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleComplete}
                  startIcon={<Check />}
                  sx={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                    },
                  }}
                >
                  Complete Setup
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowForward />}
                  sx={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                    },
                  }}
                >
                  Continue
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default CompleteProfile;
