import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Save,
  Edit,
  Cancel,
  Person,
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  Language,
  Work,
} from '@mui/icons-material';
import { getProfile, updateProfile } from '../store/userSlice';
import ProfessionalLayout from '../components/ProfessionalLayout';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [skillInput, setSkillInput] = useState('');
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

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        headline: profile.headline || '',
        phone: profile.phone || '',
        location: profile.location || '',
        linkedin: profile.linkedin || '',
        portfolio: profile.portfolio || '',
        currentRole: profile.currentRole || '',
        experience: profile.experience || '',
        skills: profile.skills || [],
        education: profile.education || '',
        desiredRole: profile.desiredRole || '',
        desiredSalary: profile.desiredSalary || '',
      });
    }
  }, [profile]);

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

  const handleSave = async () => {
    try {
      await dispatch(updateProfile(formData)).unwrap();
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        headline: profile.headline || '',
        phone: profile.phone || '',
        location: profile.location || '',
        linkedin: profile.linkedin || '',
        portfolio: profile.portfolio || '',
        currentRole: profile.currentRole || '',
        experience: profile.experience || '',
        skills: profile.skills || [],
        education: profile.education || '',
        desiredRole: profile.desiredRole || '',
        desiredSalary: profile.desiredSalary || '',
      });
    }
    setIsEditing(false);
  };

  const InfoRow = ({ icon, label, value, name, type = 'text' }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 2 }}>
      <Box sx={{ color: '#64748b', mt: 0.5 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
          {label}
        </Typography>
        {isEditing ? (
          <TextField
            fullWidth
            size="small"
            name={name}
            type={type}
            value={formData[name] || ''}
            onChange={handleChange}
          />
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 500, color: '#f8fafc' }}>
            {value || 'Not specified'}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                Profile
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                Manage your personal information
              </Typography>
            </Box>
            {!isEditing ? (
              <Button 
                variant="outlined" 
                startIcon={<Edit />} 
                onClick={() => setIsEditing(true)}
                sx={{ borderColor: 'rgba(148, 163, 184, 0.3)', color: '#f8fafc' }}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel} sx={{ borderColor: 'rgba(148, 163, 184, 0.3)', color: '#f8fafc' }}>
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Save />} 
                  onClick={handleSave} 
                  disabled={isLoading}
                  sx={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    '&:hover': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)' },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>

          <Grid container spacing={3}>
            {/* Profile Header Card */}
            <Grid item xs={12}>
              <Card sx={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Avatar
                      sx={{
                        width: 96,
                        height: 96,
                        background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                        fontSize: 36,
                        fontWeight: 700,
                        boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)',
                      }}
                    >
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                        {user?.name || 'User'}
                      </Typography>
                      {isEditing ? (
                        <TextField
                          size="small"
                          name="headline"
                          value={formData.headline}
                          onChange={handleChange}
                          placeholder="Professional Headline"
                          sx={{ mt: 1, minWidth: 300 }}
                        />
                      ) : (
                        <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                          {formData.headline || 'Add a professional headline'}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Info */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f8fafc' }}>
                    Contact Information
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)' }} />
                  <InfoRow icon={<Email />} label="Email" value={user?.email} name="email" />
                  <InfoRow icon={<Phone />} label="Phone" value={formData.phone} name="phone" />
                  <InfoRow icon={<LocationOn />} label="Location" value={formData.location} name="location" />
                  <InfoRow icon={<LinkedIn />} label="LinkedIn" value={formData.linkedin} name="linkedin" />
                  <InfoRow icon={<Language />} label="Portfolio" value={formData.portfolio} name="portfolio" />
                </CardContent>
              </Card>
            </Grid>

            {/* Experience */}
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f8fafc' }}>
                    Experience
                  </Typography>
                  <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)' }} />
                  <InfoRow icon={<Work />} label="Current Role" value={formData.currentRole} name="currentRole" />
                  <InfoRow icon={<Person />} label="Years of Experience" value={formData.experience} name="experience" />
                  <InfoRow icon={<Work />} label="Desired Role" value={formData.desiredRole} name="desiredRole" />
                  <InfoRow icon={<Work />} label="Desired Salary" value={formData.desiredSalary} name="desiredSalary" />
                </CardContent>
              </Card>
            </Grid>

            {/* Skills & Education */}
            <Grid item xs={12}>
              <Card sx={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f8fafc' }}>
                        Skills
                      </Typography>
                      {isEditing && (
                        <TextField
                          fullWidth
                          size="small"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleAddSkill}
                          placeholder="Type a skill and press Enter"
                          sx={{ mb: 2 }}
                        />
                      )}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {formData.skills.length > 0 ? (
                          formData.skills.map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              onDelete={isEditing ? () => handleRemoveSkill(skill) : undefined}
                              sx={{ 
                                bgcolor: 'rgba(6, 182, 212, 0.15)', 
                                color: '#22d3ee',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            No skills added
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f8fafc' }}>
                        Education
                      </Typography>
                      {isEditing ? (
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          name="education"
                          value={formData.education}
                          onChange={handleChange}
                          placeholder="Your education background"
                        />
                      ) : (
                        <Typography variant="body1" sx={{ color: '#e2e8f0' }}>
                          {formData.education || 'No education information added'}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    </ProfessionalLayout>
  );
};

export default Profile;
