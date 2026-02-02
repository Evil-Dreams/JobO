import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack,
  Work,
  Business,
  LocationOn,
  AttachMoney,
  Link,
  Notes,
  Save,
} from '@mui/icons-material';
import { createApplication } from '../store/applicationsSlice';
import ProfessionalLayout from '../components/ProfessionalLayout';

const AddApplication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    jobUrl: '',
    status: 'Applied',
    notes: '',
    dateApplied: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(createApplication(formData)).unwrap();
      navigate('/applications');
    } catch (error) {
      console.error('Failed to create application:', error);
    }
    setIsSubmitting(false);
  };

  const statusOptions = ['Applied', 'Interview', 'Offer', 'Rejected'];

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/applications')}
              sx={{ mb: 2, color: '#94a3b8' }}
            >
              Back to Applications
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
              Add New Application
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
              Track a new job application
            </Typography>
          </Box>

          {/* Form */}
          <Card sx={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}>
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Company */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Business sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Position */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Position / Job Title"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Location */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., New York, NY or Remote"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Salary */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Salary Range"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      placeholder="e.g., $100,000 - $120,000"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachMoney sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Job URL */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Job Posting URL"
                      name="jobUrl"
                      value={formData.jobUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Link sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Status & Date */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      select
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Date Applied"
                      name="dateApplied"
                      type="date"
                      value={formData.dateApplied}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Notes */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      placeholder="Add any notes about this application..."
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                            <Notes sx={{ color: '#94a3b8' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Actions */}
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => navigate('/applications')}
                        sx={{ 
                          borderColor: 'rgba(148, 163, 184, 0.3)',
                          color: '#94a3b8',
                          '&:hover': {
                            borderColor: 'rgba(148, 163, 184, 0.5)',
                            bgcolor: 'rgba(148, 163, 184, 0.1)',
                          },
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        disabled={isSubmitting || !formData.company || !formData.position}
                        sx={{
                          background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                          },
                        }}
                      >
                        {isSubmitting ? 'Saving...' : 'Save Application'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ProfessionalLayout>
  );
};

export default AddApplication;
