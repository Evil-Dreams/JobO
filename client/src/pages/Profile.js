import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Avatar,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Save,
  Edit,
  Cancel,
} from '@mui/icons-material';
import userService from '../services/userService';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: '',
    headline: '',
    bio: '',
    location: '',
    email: '',
    phone: '',
    // Additional basic info fields
    dateOfBirth: '',
    gender: '',
    nationality: '',
    languages: '',
    workAuthorization: '',
    salaryExpectation: '',
    availability: '',
    linkedin: '',
    github: '',
    twitter: '',
    portfolio: '',
    skillsText: '',
    // Education fields
    degree: '',
    college: '',
    university: '',
    branch: '',
    startYear: '',
    endYear: '',
    gpa: '',
    // Experience fields
    company: '',
    position: '',
    experienceStart: '',
    experienceEnd: '',
    experienceDescription: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await userService.getProfile();
        const skillsText = Array.isArray(profile?.skills)
          ? profile.skills.map((skill) => skill?.name).filter(Boolean).join(', ')
          : '';

        setFormData({
          fullName: profile?.name || '',
          headline: profile?.headline || '',
          bio: profile?.bio || '',
          location: profile?.location || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          // Additional basic info fields
          dateOfBirth: profile?.dateOfBirth || '',
          gender: profile?.gender || '',
          nationality: profile?.nationality || '',
          languages: profile?.languages || '',
          workAuthorization: profile?.workAuthorization || '',
          salaryExpectation: profile?.salaryExpectation || '',
          availability: profile?.availability || '',
          linkedin: profile?.links?.linkedin || '',
          github: profile?.links?.github || '',
          twitter: profile?.links?.twitter || '',
          portfolio: profile?.links?.portfolio || '',
          skillsText,
          // Education fields
          degree: profile?.education?.degree || '',
          college: profile?.education?.college || '',
          university: profile?.education?.university || '',
          branch: profile?.education?.branch || '',
          startYear: profile?.education?.startYear || '',
          endYear: profile?.education?.endYear || '',
          gpa: profile?.education?.gpa || '',
          // Experience fields
          company: profile?.experience?.company || '',
          position: profile?.experience?.position || '',
          experienceStart: profile?.experience?.startYear || '',
          experienceEnd: profile?.experience?.endYear || '',
          experienceDescription: profile?.experience?.description || '',
        });
        
      } catch (error) {
        setErrorMessage('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const skillsArray = formData.skillsText
        .split(',')
        .map((skill) => skill.trim())
        .filter(Boolean)
        .map((name) => ({ name }));

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('headline', formData.headline);
      formDataToSend.append('bio', formData.bio);
      
      // Additional basic info fields
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('nationality', formData.nationality);
      formDataToSend.append('languages', formData.languages);
      formDataToSend.append('workAuthorization', formData.workAuthorization);
      formDataToSend.append('salaryExpectation', formData.salaryExpectation);
      formDataToSend.append('availability', formData.availability);
      
      // Education data as JSON
      const educationData = {
        degree: formData.degree,
        college: formData.college,
        university: formData.university,
        branch: formData.branch,
        startYear: formData.startYear,
        endYear: formData.endYear,
        gpa: formData.gpa
      };
      formDataToSend.append('education', JSON.stringify(educationData));
      
      // Experience data as JSON
      const experienceData = {
        company: formData.company,
        position: formData.position,
        startYear: formData.experienceStart,
        endYear: formData.experienceEnd,
        description: formData.experienceDescription
      };
      formDataToSend.append('experience', JSON.stringify(experienceData));
      
      formDataToSend.append('links', JSON.stringify({
        linkedin: formData.linkedin,
        github: formData.github,
        twitter: formData.twitter,
        portfolio: formData.portfolio,
      }));
      formDataToSend.append('skills', JSON.stringify(skillsArray));

      await userService.updateProfile(formDataToSend);

      setIsEditing(false);
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSuccessMessage('');
  };

  return (
    <>
      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh' }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                Profile
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8' }}>
                Manage your professional information
              </Typography>
            </Box>
            <Box>
              {isEditing ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={handleCancel}
                    sx={{ borderColor: '#475569', color: '#94a3b8' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSave}
                    sx={{ 
                      background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                  sx={{ 
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                    }
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>

          {/* Success/Error Messages */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Profile Content */}
          <Box sx={{ 
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: 2,
            p: 4,
            minHeight: '600px'
          }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(148, 163, 184, 0.2)', mb: 4 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Basic Info" />
                <Tab label="Contact" />
                <Tab label="Social Links" />
                <Tab label="Skills" />
                <Tab label="Education" />
                <Tab label="Experience" />
              </Tabs>
            </Box>

            {/* Basic Info Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', mb: 3 }}>
                  Basic Information
                </Typography>
                
                {/* Profile Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    }}
                  >
                    <img 
                      src="/iblis_logo.png" 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    {isEditing ? (
                      <>
                        <TextField
                          fullWidth
                          size="small"
                          label="Full Name"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          sx={{ mb: 2 }}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="Professional Headline"
                          name="headline"
                          value={formData.headline}
                          onChange={handleChange}
                        />
                      </>
                    ) : (
                      <>
                        <Typography variant="h6" sx={{ color: '#f8fafc', mb: 1 }}>
                          {formData.fullName || 'Your Name'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                          {formData.headline || 'Your professional headline'}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>

                {/* Bio */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" sx={{ color: '#cbd5e1', mb: 2 }}>
                    Bio
                  </Typography>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                      {formData.bio || 'No bio added yet'}
                    </Typography>
                  )}
                </Box>

                {/* Additional Information */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Date of Birth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ position: 'relative' }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          position: 'absolute',
                          top: '-8px',
                          left: '12px',
                          color: '#cbd5e1',
                          zIndex: 1,
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: 'transparent'
                        }}
                      >
                        Gender
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        select
                        disabled={!isEditing}
                        SelectProps={{ 
                          native: true,
                          sx: {
                            height: '40px',
                            '& .MuiNativeSelect-select': {
                              height: '40px',
                              padding: '8px 14px',
                              display: 'flex',
                              alignItems: 'center'
                            }
                          }
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Languages"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      placeholder="e.g., English, Tamil, Hindi"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ position: 'relative' }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          position: 'absolute',
                          top: '-8px',
                          left: '12px',
                          color: '#cbd5e1',
                          zIndex: 1,
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: 'transparent'
                        }}
                      >
                        Work Authorization
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="workAuthorization"
                        value={formData.workAuthorization}
                        onChange={handleChange}
                        select
                        disabled={!isEditing}
                        SelectProps={{ 
                          native: true,
                          sx: {
                            height: '40px',
                            '& .MuiNativeSelect-select': {
                              height: '40px',
                              padding: '8px 14px',
                              display: 'flex',
                              alignItems: 'center'
                            }
                          }
                        }}
                      >
                        <option value="">Select Status</option>
                        <option value="Citizen">Citizen</option>
                        <option value="Permanent Resident">Permanent Resident</option>
                        <option value="Work Visa">Work Visa</option>
                        <option value="Student Visa">Student Visa</option>
                        <option value="Other">Other</option>
                      </TextField>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Salary Expectation"
                      name="salaryExpectation"
                      value={formData.salaryExpectation}
                      onChange={handleChange}
                      placeholder="e.g., $80,000 - $100,000"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ position: 'relative' }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          position: 'absolute',
                          top: '-8px',
                          left: '12px',
                          color: '#cbd5e1',
                          zIndex: 1,
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          backgroundColor: 'transparent'
                        }}
                      >
                        Availability
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        select
                        disabled={!isEditing}
                        SelectProps={{ 
                          native: true,
                          sx: {
                            height: '40px',
                            '& .MuiNativeSelect-select': {
                              height: '40px',
                              padding: '8px 14px',
                              display: 'flex',
                              alignItems: 'center'
                            }
                          }
                        }}
                      >
                        <option value="">Select Availability</option>
                        <option value="Immediately">Immediately</option>
                        <option value="2 weeks">2 weeks</option>
                        <option value="1 month">1 month</option>
                        <option value="2 months">2 months</option>
                        <option value="3+ months">3+ months</option>
                      </TextField>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Contact Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', mb: 3 }}>
                  Contact Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Social Links Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', mb: 3 }}>
                  Social Links
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="LinkedIn"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="GitHub"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="https://twitter.com/yourusername"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Skills Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', mb: 3 }}>
                  Skills
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Skills"
                  name="skillsText"
                  value={formData.skillsText}
                  onChange={handleChange}
                  placeholder="Enter your skills separated by commas (e.g., JavaScript, React, Node.js, Python)"
                  disabled={!isEditing}
                  helperText="Separate multiple skills with commas"
                />
              </Box>
            )}

            {/* Education Tab */}
            {activeTab === 4 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', mb: 3 }}>
                  Education
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      placeholder="B.Sc. Computer Science"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Branch/Specialization"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      placeholder="Computer Science & Engineering"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="College/Institution"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="ABC College of Engineering"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="University"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      placeholder="XYZ University"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Start Year"
                      name="startYear"
                      value={formData.startYear}
                      onChange={handleChange}
                      placeholder="2018"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="End Year"
                      name="endYear"
                      value={formData.endYear}
                      onChange={handleChange}
                      placeholder="2022"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="GPA/Percentage"
                      name="gpa"
                      value={formData.gpa}
                      onChange={handleChange}
                      placeholder="8.5 CGPA or 85%"
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Experience Tab */}
            {activeTab === 5 && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', mb: 3 }}>
                  Professional Experience
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="ABC Technologies"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Position/Role"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="Software Engineer"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Start Date"
                      name="experienceStart"
                      value={formData.experienceStart}
                      onChange={handleChange}
                      placeholder="Jan 2022"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="End Date"
                      name="experienceEnd"
                      value={formData.experienceEnd}
                      onChange={handleChange}
                      placeholder="Present or Dec 2023"
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Job Description & Responsibilities"
                      name="experienceDescription"
                      value={formData.experienceDescription}
                      onChange={handleChange}
                      placeholder="Describe your key responsibilities, achievements, and skills used in this role..."
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Profile;
