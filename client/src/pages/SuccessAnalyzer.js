import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
  CircularProgress,
  Alert,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  TrendingUp,
  AutoAwesome,
  CheckCircle,
  Warning,
  TipsAndUpdates,
  Psychology,
  Star,
  Lightbulb,
} from '@mui/icons-material';
import { predictSuccess } from '../store/aiSlice';
import ProfessionalLayout from '../components/ProfessionalLayout';

const SuccessAnalyzer = () => {
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.applications);
  const { successPrediction, isLoading, error } = useSelector((state) => state.ai);

  const [selectedApp, setSelectedApp] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleAnalyze = () => {
    if (!selectedApp || !jobDescription.trim()) return;
    dispatch(predictSuccess({ applicationId: selectedApp, jobDescription }));
  };

  const getScoreColor = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 70) return '#10b981';
    if (numScore >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    const numScore = parseInt(score);
    if (numScore >= 80) return 'Excellent Match';
    if (numScore >= 60) return 'Strong Match';
    if (numScore >= 40) return 'Moderate Match';
    return 'Needs Improvement';
  };

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <TrendingUp />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Success Probability
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                  Analyze your chances of success for a specific job application
                </Typography>
              </Box>
            </Box>
          </Box>

          <Grid container spacing={4} sx={{ flex: 1 }}>
            {/* Input Section */}
            <Grid item xs={12} lg={5} sx={{ display: 'flex' }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Psychology sx={{ color: '#10b981' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Your Profile
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <TextField
                    fullWidth
                    select
                    label="Select Application"
                    value={selectedApp}
                    onChange={(e) => setSelectedApp(e.target.value)}
                    sx={{ mb: 3 }}
                  >
                    {applications.length === 0 ? (
                      <MenuItem disabled>No applications found</MenuItem>
                    ) : (
                      applications.map((app) => (
                        <MenuItem key={app._id} value={app._id}>
                          {app.position} at {app.company}
                        </MenuItem>
                      ))
                    )}
                  </TextField>

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Job Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    sx={{ mb: 3 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                    onClick={handleAnalyze}
                    disabled={!selectedApp || !jobDescription.trim() || isLoading}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    }}
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Match'}
                  </Button>

                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Results Section */}
            <Grid item xs={12} lg={7} sx={{ display: 'flex' }}>
              {successPrediction?.successProbability ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                  {/* Score Card */}
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
                      color: '#fff',
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={5}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Box
                              sx={{
                                width: 160,
                                height: 160,
                                borderRadius: '50%',
                                background: `conic-gradient(${getScoreColor(
                                  successPrediction.successProbability
                                )} ${parseInt(successPrediction.successProbability) * 3.6}deg, rgba(255,255,255,0.2) 0deg)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 136,
                                  height: 136,
                                  borderRadius: '50%',
                                  bgcolor: '#064e3b',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                                  {successPrediction.successProbability}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                  Match Score
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              icon={<Star sx={{ color: '#fff !important' }} />}
                              label={getScoreLabel(successPrediction.successProbability)}
                              sx={{
                                bgcolor: getScoreColor(successPrediction.successProbability),
                                color: '#fff',
                                fontWeight: 600,
                                px: 1,
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={7}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Confidence & Timeline
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Confidence Level</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {successPrediction.confidenceLevel || 'N/A'}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2">Estimated Timeline</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {successPrediction.timelineEstimate || 'N/A'}
                              </Typography>
                            </Box>
                          </Box>

                          {successPrediction.positiveFactors?.length > 0 && (
                            <Box>
                              <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
                                Positive Factors
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {successPrediction.positiveFactors.slice(0, 4).map((factor, idx) => (
                                  <Chip
                                    key={idx}
                                    label={factor}
                                    size="small"
                                    sx={{
                                      bgcolor: 'rgba(255,255,255,0.2)',
                                      color: '#fff',
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Strengths & Weaknesses */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <CheckCircle sx={{ color: '#10b981' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              Your Strengths
                            </Typography>
                          </Box>
                          <List dense>
                            {successPrediction.positiveFactors?.map((strength, idx) => (
                              <ListItem key={idx} sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <CheckCircle sx={{ color: '#10b981', fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText primary={strength} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Warning sx={{ color: '#f59e0b' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              Potential Gaps
                            </Typography>
                          </Box>
                          <List dense>
                            {successPrediction.riskFactors?.map((weakness, idx) => (
                              <ListItem key={idx} sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Warning sx={{ color: '#f59e0b', fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText primary={weakness} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Recommendations */}
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Lightbulb sx={{ color: '#6366f1' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Recommendations to Improve
                        </Typography>
                      </Box>
                      <List dense>
                        {successPrediction.recommendations?.map((rec, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <TipsAndUpdates sx={{ color: '#6366f1', fontSize: 18 }} />
                            </ListItemIcon>
                            <ListItemText primary={rec} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>

                  {(successPrediction.competitorAnalysis || successPrediction.nextSteps?.length > 0) && (
                    <Card>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <Lightbulb sx={{ color: '#0ea5e9' }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Competitive Insight & Next Steps
                          </Typography>
                        </Box>
                        {successPrediction.competitorAnalysis && (
                          <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
                            {successPrediction.competitorAnalysis}
                          </Typography>
                        )}
                        {successPrediction.nextSteps?.length > 0 && (
                          <List dense>
                            {successPrediction.nextSteps.map((step, idx) => (
                              <ListItem key={idx} sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <TipsAndUpdates sx={{ color: '#0ea5e9', fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText primary={step} />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Box>
              ) : (
                <Card sx={{ height: '100%', minHeight: 400 }}>
                  <CardContent
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      p: 6,
                    }}
                  >
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 4,
                        bgcolor: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <TrendingUp sx={{ fontSize: 40, color: '#94a3b8' }} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#0f172a' }}>
                      Ready to Analyze
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 400 }}>
                      Select a job application, enter your skills and experience, then click "Analyze Match" to see your success probability.
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ProfessionalLayout>
  );
};

export default SuccessAnalyzer;
