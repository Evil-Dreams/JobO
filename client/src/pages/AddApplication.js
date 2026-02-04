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
    title: '',
    location: '',
    salaryRange: '',
    sourceLink: '',
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
      <Box sx={{ 
        p: { xs: 1, md: 1.5 }, 
        height: 'calc(100vh - 100px)', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Container maxWidth="xs" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <Box sx={{ mb: 1, flexShrink: 0 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/applications')}
              sx={{ mb: 0.5, color: '#94a3b8', fontSize: '0.875rem' }}
            >
              Back
            </Button>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc', fontSize: '1.125rem' }}>
              Add Application
            </Typography>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              Track a new job application
            </Typography>
          </Box>

          {/* Form - Takes remaining space */}
          <Card sx={{
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ 
              p: 1.5, 
              flex: 1, 
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(148, 163, 184, 0.1)',
                borderRadius: '2px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(148, 163, 184, 0.3)',
                borderRadius: '2px',
              }
            }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {/* Company */}
                  <TextField
                    fullWidth
                    size="small"
                    label="Company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mr: 0.5 }}>
                          <Business sx={{ color: '#94a3b8', fontSize: '1rem' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                  />

                  {/* Position */}
                  <TextField
                    fullWidth
                    size="small"
                    label="Position / Job Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mr: 0.5 }}>
                          <Work sx={{ color: '#94a3b8', fontSize: '1rem' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                  />

                  {/* Location and Salary */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g., New York, NY"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 0.5 }}>
                            <LocationOn sx={{ color: '#94a3b8', fontSize: '1rem' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      label="Salary Range"
                      name="salaryRange"
                      value={formData.salaryRange}
                      onChange={handleChange}
                      placeholder="e.g., $100k"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ mr: 0.5 }}>
                            <AttachMoney sx={{ color: '#94a3b8', fontSize: '1rem' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    />
                  </Box>

                  {/* Job URL */}
                  <TextField
                    fullWidth
                    size="small"
                    label="Job Posting URL"
                    name="sourceLink"
                    value={formData.sourceLink}
                    onChange={handleChange}
                    placeholder="https://example.com/job"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mr: 0.5 }}>
                          <Link sx={{ color: '#94a3b8', fontSize: '1rem' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                  />

                  {/* Status and Date */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      select
                      label="Status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    >
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status} sx={{ fontSize: '0.875rem' }}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      size="small"
                      label="Date"
                      name="dateApplied"
                      type="date"
                      value={formData.dateApplied}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                    />
                  </Box>

                  {/* Notes */}
                  <TextField
                    fullWidth
                    size="small"
                    label="Notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    placeholder="Add notes..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1, mr: 0.5 }}>
                          <Notes sx={{ color: '#94a3b8', fontSize: '1rem' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
                  />

                  {/* Actions */}
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 1, 
                    justifyContent: 'flex-end', 
                    mt: 1,
                    flexShrink: 0
                  }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => navigate('/applications')}
                      sx={{ 
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                        color: '#94a3b8',
                        fontSize: '0.875rem',
                        py: 0.5,
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
                      disabled={isSubmitting || !formData.company || !formData.title}
                      sx={{
                        background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                        fontSize: '0.875rem',
                        py: 0.5,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                        },
                      }}
                    >
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                  </Box>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ProfessionalLayout>
  );
};

export default AddApplication;
