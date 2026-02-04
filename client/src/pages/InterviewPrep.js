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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Psychology,
  AutoAwesome,
} from '@mui/icons-material';
import { fetchInterviewGuidance } from '../store/aiSlice';
import ProfessionalLayout from '../components/ProfessionalLayout';

const InterviewPrep = () => {
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.applications);
  const { interviewGuidance, isLoading, error } = useSelector((state) => state.ai);

  const [selectedApp, setSelectedApp] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleGenerateGuidance = () => {
    const application = applications.find((app) => app._id === selectedApp);
    if (application && jobDescription.trim()) {
      dispatch(
        fetchInterviewGuidance({
          company: application.company,
          jobDescription,
        })
      );
    }
  };

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
              Interview Prep
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
              Practice with AI-generated interview questions and get feedback
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ flex: 1 }}>
            {/* Setup Panel */}
            <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
              <Card sx={{
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'rgba(245, 158, 11, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fbbf24',
                        boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <Psychology />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                        Practice Setup
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Configure your session
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 3, borderColor: 'rgba(148, 163, 184, 0.1)' }} />

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
                    onClick={handleGenerateGuidance}
                    disabled={!selectedApp || !jobDescription.trim() || isLoading}
                    sx={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                      },
                    }}
                  >
                    {isLoading ? 'Generating...' : 'Generate Guidance'}
                  </Button>

                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </CardContent>
              </Card>

            </Grid>

            {/* Practice Area */}
            <Grid item xs={12} md={8} sx={{ display: 'flex' }}>
              <Card sx={{ 
                flex: 1,
                minHeight: 500,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 0, height: '100%' }}>
                  {!interviewGuidance ? (
                    <Box
                      sx={{
                        height: 500,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        p: 4,
                      }}
                    >
                      <Psychology sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                      <Typography variant="h6" sx={{ textAlign: 'center', mb: 1, color: '#94a3b8' }}>
                        Ready to Prepare?
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748b' }}>
                        Select an application and add a job description to get tailored interview guidance
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box>
                        <Typography variant="h6" sx={{ mb: 1.5, color: '#f8fafc' }}>
                          Common Questions
                        </Typography>
                        <List dense>
                          {interviewGuidance.commonQuestions?.map((question, idx) => (
                            <ListItem key={idx} sx={{ px: 0 }}>
                              <ListItemText primary={question} sx={{ color: '#e2e8f0' }} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>

                      {interviewGuidance.answerFramework && (
                        <Box>
                          <Typography variant="h6" sx={{ mb: 1.5, color: '#f8fafc' }}>
                            Answer Framework
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                            {interviewGuidance.answerFramework.question}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e2e8f0', mb: 1 }}>
                            {interviewGuidance.answerFramework.framework}
                          </Typography>
                          <List dense>
                            {interviewGuidance.answerFramework.keyPoints?.map((point, idx) => (
                              <ListItem key={idx} sx={{ px: 0 }}>
                                <ListItemText primary={point} sx={{ color: '#e2e8f0' }} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {interviewGuidance.companyResearch && (
                        <Box>
                          <Typography variant="h6" sx={{ mb: 1.5, color: '#f8fafc' }}>
                            Company Research
                          </Typography>
                          <List dense>
                            {interviewGuidance.companyResearch.keyFacts?.map((fact, idx) => (
                              <ListItem key={idx} sx={{ px: 0 }}>
                                <ListItemText primary={fact} sx={{ color: '#e2e8f0' }} />
                              </ListItem>
                            ))}
                          </List>
                          {interviewGuidance.companyResearch.cultureInsights && (
                            <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                              {interviewGuidance.companyResearch.cultureInsights}
                            </Typography>
                          )}
                        </Box>
                      )}

                      {interviewGuidance.technicalPrep?.length > 0 && (
                        <Box>
                          <Typography variant="h6" sx={{ mb: 1.5, color: '#f8fafc' }}>
                            Technical Prep
                          </Typography>
                          <List dense>
                            {interviewGuidance.technicalPrep.map((topic, idx) => (
                              <ListItem key={idx} sx={{ px: 0 }}>
                                <ListItemText primary={topic} sx={{ color: '#e2e8f0' }} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {interviewGuidance.questionsToAsk?.length > 0 && (
                        <Box>
                          <Typography variant="h6" sx={{ mb: 1.5, color: '#f8fafc' }}>
                            Questions to Ask
                          </Typography>
                          <List dense>
                            {interviewGuidance.questionsToAsk.map((question, idx) => (
                              <ListItem key={idx} sx={{ px: 0 }}>
                                <ListItemText primary={question} sx={{ color: '#e2e8f0' }} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {interviewGuidance.followUpEmailTemplate && (
                        <Box>
                          <Typography variant="h6" sx={{ mb: 1.5, color: '#f8fafc' }}>
                            Follow-Up Email Template
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
                            {interviewGuidance.followUpEmailTemplate}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ProfessionalLayout>
  );
};

export default InterviewPrep;
