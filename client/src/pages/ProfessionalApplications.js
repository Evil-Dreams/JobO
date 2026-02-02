import React, { useEffect, useState } from 'react';
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
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  IconButton,
  Menu,
} from '@mui/material';
import {
  Search,
  Add,
  FilterList,
  MoreVert,
  WorkOutline,
  LocationOn,
  AttachMoney,
  CalendarToday,
} from '@mui/icons-material';
import { getApplications, deleteApplication } from '../store/applicationsSlice';
import ProfessionalLayout from '../components/ProfessionalLayout';

const ProfessionalApplications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applications, isLoading } = useSelector((state) => state.applications);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    dispatch(getApplications());
  }, [dispatch]);

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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMenuClick = (event, app) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedApp(app);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedApp(null);
  };

  const handleDelete = () => {
    if (selectedApp) {
      dispatch(deleteApplication(selectedApp._id));
    }
    handleMenuClose();
  };

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 3, md: 5 }, minHeight: '100vh' }}>
        <Container maxWidth="xl" disableGutters>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5, flexWrap: 'wrap', gap: 3 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#f8fafc', mb: 1, letterSpacing: '-0.02em' }}>
                Applications
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8', fontSize: '1.0625rem' }}>
                Track and manage your job applications
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/applications/add')}
              sx={{ 
                px: 4, 
                py: 1.5,
                background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                '&:hover': {
                  boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
                },
              }}
            >
              New Application
            </Button>
          </Box>

          {/* Filters */}
          <Card sx={{ 
            mb: 4,
            background: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Search by company or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="medium"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#64748b' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="medium">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                      startAdornment={<FilterList sx={{ color: '#64748b', mr: 1.5, ml: 0.5 }} />}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="Applied">Applied</MenuItem>
                      <MenuItem value="Interview">Interview</MenuItem>
                      <MenuItem value="Offer">Offer</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', fontWeight: 600, textAlign: { md: 'right' } }}>
                    {filteredApplications.length} application{filteredApplications.length !== 1 ? 's' : ''} found
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Applications Grid */}
          {isLoading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography sx={{ color: '#94a3b8' }}>Loading applications...</Typography>
            </Box>
          ) : filteredApplications.length === 0 ? (
            <Card sx={{ 
              textAlign: 'center', 
              py: 12,
              background: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
            }}>
              <WorkOutline sx={{ fontSize: 72, color: '#334155', mb: 3 }} />
              <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 700, color: '#f8fafc' }}>
                No applications found
              </Typography>
              <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4, fontSize: '1.0625rem' }}>
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Start tracking your job applications'}
              </Typography>
              {!searchTerm && statusFilter === 'all' && (
                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<Add />} 
                  onClick={() => navigate('/applications/add')}
                  sx={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    '&:hover': {
                      boxShadow: '0 0 30px rgba(6, 182, 212, 0.5)',
                    },
                  }}
                >
                  Add Your First Application
                </Button>
              )}
            </Card>
          ) : (
            <Grid container spacing={4}>
              {filteredApplications.map((app) => {
                const style = getStatusStyle(app.status);
                return (
                  <Grid item xs={12} sm={6} lg={4} key={app._id}>
                    <Card
                      onClick={() => navigate(`/applications/${app._id}`)}
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        background: 'rgba(30, 41, 59, 0.5)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: '0 20px 40px -12px rgba(6, 182, 212, 0.2)',
                          borderColor: 'rgba(6, 182, 212, 0.3)',
                        },
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', gap: 2.5, mb: 3 }}>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                              fontWeight: 700,
                              fontSize: 20,
                            }}
                          >
                            {app.company?.charAt(0)?.toUpperCase() || '?'}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, mb: 0.5, color: '#f8fafc' }} noWrap>
                              {app.position}
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#94a3b8', fontSize: '0.9375rem' }} noWrap>
                              {app.company}
                            </Typography>
                          </Box>
                          <IconButton 
                            size="small" 
                            onClick={(e) => handleMenuClick(e, app)}
                            sx={{ color: '#64748b', '&:hover': { color: '#22d3ee' } }}
                          >
                            <MoreVert />
                          </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, mb: 3.5 }}>
                          {app.location && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <LocationOn sx={{ fontSize: 18, color: '#64748b' }} />
                              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>
                                {app.location}
                              </Typography>
                            </Box>
                          )}
                          {app.salary && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                              <AttachMoney sx={{ fontSize: 18, color: '#64748b' }} />
                              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.8125rem', fontWeight: 500 }}>
                                {app.salary}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Chip
                            label={app.status || 'Applied'}
                            size="small"
                            sx={{ 
                              bgcolor: style.bg, 
                              color: style.color, 
                              fontWeight: 700,
                              borderRadius: 2,
                              height: 28,
                            }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <CalendarToday sx={{ fontSize: 14, color: '#64748b' }} />
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                              {formatDate(app.dateApplied || app.createdAt)}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Context Menu */}
      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
            minWidth: 180,
          }
        }}
      >
        <MenuItem 
          onClick={() => { navigate(`/applications/${selectedApp?._id}`); handleMenuClose(); }}
          sx={{ py: 1.5, fontWeight: 600, color: '#f8fafc' }}
        >
          View Details
        </MenuItem>
        <MenuItem 
          onClick={handleDelete} 
          sx={{ color: '#f87171', py: 1.5, fontWeight: 600 }}
        >
          Delete
        </MenuItem>
      </Menu>
    </ProfessionalLayout>
  );
};

export default ProfessionalApplications;
