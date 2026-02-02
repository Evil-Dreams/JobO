import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Save,
  Cancel,
  Link as LinkIcon,
  LocationOn,
  AttachMoney,
  CalendarToday,
  OpenInNew,
  Work,
  Business,
  Notes,
} from '@mui/icons-material';
// IconButton removed - not currently used
import { getApplication, updateApplication, deleteApplication } from '../store/applicationsSlice';
import ProfessionalLayout from '../components/ProfessionalLayout';

const ApplicationDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentApplication, isLoading } = useSelector((state) => state.applications);

  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    jobUrl: '',
    status: 'Applied',
    notes: '',
    dateApplied: '',
  });

  useEffect(() => {
    dispatch(getApplication(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentApplication) {
      setFormData({
        company: currentApplication.company || '',
        position: currentApplication.position || '',
        location: currentApplication.location || '',
        salary: currentApplication.salary || '',
        jobUrl: currentApplication.jobUrl || '',
        status: currentApplication.status || 'Applied',
        notes: currentApplication.notes || '',
        dateApplied: currentApplication.dateApplied?.split('T')[0] || '',
      });
    }
  }, [currentApplication]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await dispatch(updateApplication({ id, applicationData: formData }));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteApplication(id));
    navigate('/applications');
  };

  const getStatusStyle = (status) => {
    const styles = {
      Applied: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
      Interview: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' },
      Offer: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
      Rejected: { bg: 'rgba(239, 68, 68, 0.15)', color: '#f87171' },
    };
    return styles[status] || styles.Applied;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const statusOptions = ['Applied', 'Interview', 'Offer', 'Rejected'];

  if (isLoading || !currentApplication) {
    return (
      <ProfessionalLayout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </ProfessionalLayout>
    );
  }

  const style = getStatusStyle(currentApplication.status);

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/applications')}
              sx={{ mb: 2, color: '#94a3b8' }}
            >
              Back to Applications
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {currentApplication.company?.charAt(0) || '?'}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                    {currentApplication.position}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 400 }}>
                    {currentApplication.company}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                {!isEditing ? (
                  <>
                    <Button 
                      variant="outlined" 
                      startIcon={<Edit />} 
                      onClick={() => setIsEditing(true)}
                      sx={{
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                        color: '#94a3b8',
                        '&:hover': {
                          borderColor: '#06b6d4',
                          color: '#22d3ee',
                          bgcolor: 'rgba(6, 182, 212, 0.1)',
                        },
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => setDeleteDialogOpen(true)}
                      sx={{
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        '&:hover': {
                          borderColor: '#ef4444',
                          bgcolor: 'rgba(239, 68, 68, 0.1)',
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outlined" 
                      startIcon={<Cancel />} 
                      onClick={() => setIsEditing(false)}
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
                      variant="contained" 
                      startIcon={<Save />} 
                      onClick={handleSave}
                      sx={{
                        background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                        },
                      }}
                    >
                      Save Changes
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Main Info */}
            <Grid item xs={12} lg={8}>
              <Card sx={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  {isEditing ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Business sx={{ color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Position"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Work sx={{ color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationOn sx={{ color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Salary"
                          name="salary"
                          value={formData.salary}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachMoney sx={{ color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Job URL"
                          name="jobUrl"
                          value={formData.jobUrl}
                          onChange={handleChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LinkIcon sx={{ color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
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
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Notes"
                          name="notes"
                          value={formData.notes}
                          onChange={handleChange}
                          multiline
                          rows={4}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                <Notes sx={{ color: '#94a3b8' }} />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      <Grid container spacing={3}>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <LocationOn sx={{ fontSize: 18, color: '#64748b' }} />
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                              Location
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#f8fafc' }}>
                            {currentApplication.location || 'Not specified'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <AttachMoney sx={{ fontSize: 18, color: '#64748b' }} />
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                              Salary
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#f8fafc' }}>
                            {currentApplication.salary || 'Not specified'}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <CalendarToday sx={{ fontSize: 18, color: '#64748b' }} />
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                              Applied
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 500, color: '#f8fafc' }}>
                            {formatDate(currentApplication.dateApplied || currentApplication.createdAt)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                            Status
                          </Typography>
                          <Chip
                            label={currentApplication.status || 'Applied'}
                            sx={{ bgcolor: style.bg, color: style.color, fontWeight: 500 }}
                          />
                        </Grid>
                      </Grid>

                      {currentApplication.jobUrl && (
                        <>
                          <Divider sx={{ my: 3, borderColor: 'rgba(148, 163, 184, 0.1)' }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                              Job Posting
                            </Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              endIcon={<OpenInNew />}
                              href={currentApplication.jobUrl}
                              target="_blank"
                              sx={{
                                borderColor: 'rgba(6, 182, 212, 0.3)',
                                color: '#22d3ee',
                                '&:hover': {
                                  borderColor: '#06b6d4',
                                  bgcolor: 'rgba(6, 182, 212, 0.1)',
                                },
                              }}
                            >
                              View Job Posting
                            </Button>
                          </Box>
                        </>
                      )}

                      {currentApplication.notes && (
                        <>
                          <Divider sx={{ my: 3, borderColor: 'rgba(148, 163, 184, 0.1)' }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                              Notes
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#e2e8f0' }}>
                              {currentApplication.notes}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ 
                mb: 3,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f8fafc' }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate('/cover-letters')}
                      sx={{
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                        color: '#94a3b8',
                        '&:hover': {
                          borderColor: '#06b6d4',
                          color: '#22d3ee',
                          bgcolor: 'rgba(6, 182, 212, 0.1)',
                        },
                      }}
                    >
                      Generate Cover Letter
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate('/interview-prep')}
                      sx={{
                        borderColor: 'rgba(148, 163, 184, 0.3)',
                        color: '#94a3b8',
                        '&:hover': {
                          borderColor: '#06b6d4',
                          color: '#22d3ee',
                          bgcolor: 'rgba(6, 182, 212, 0.1)',
                        },
                      }}
                    >
                      Practice Interview
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#f8fafc' }}>
                    Timeline
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#06b6d4',
                          mt: 0.8,
                        }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#f8fafc' }}>
                          Application created
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                          {formatDate(currentApplication.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    {currentApplication.updatedAt !== currentApplication.createdAt && (
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: '#64748b',
                            mt: 0.8,
                          }}
                        />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#f8fafc' }}>
                            Last updated
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                            {formatDate(currentApplication.updatedAt)}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Application?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this application for{' '}
            <strong>{currentApplication.position}</strong> at{' '}
            <strong>{currentApplication.company}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </ProfessionalLayout>
  );
};

export default ApplicationDetail;
