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
  IconButton,
} from '@mui/material';
import {
  Article,
  AutoAwesome,
  ContentCopy,
  Download,
  Refresh,
} from '@mui/icons-material';
import { generateCoverLetter } from '../store/aiSlice';
import ProfessionalLayout from '../components/ProfessionalLayout';

const CoverLetters = () => {
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.applications);
  const { coverLetter, isLoading, error } = useSelector((state) => state.ai);

  const [selectedApp, setSelectedApp] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const application = applications.find((app) => app._id === selectedApp);
    if (application) {
      dispatch(
        generateCoverLetter({
          company: application.company,
          position: application.position || application.jobTitle,
          jobDescription,
          resumeText,
        })
      );
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover-letter.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, minHeight: '100vh', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Container maxWidth="lg" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
              Cover Letters
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
              Generate AI-powered cover letters tailored to your applications
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ flex: 1 }}>
            {/* Generator Form */}
            <Grid item xs={12} md={5} sx={{ display: 'flex' }}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: 'rgba(139, 92, 246, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#a78bfa',
                        boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <AutoAwesome />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                        AI Generator
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Powered by Google Gemini
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
                    rows={4}
                    label="Job Description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Resume Text"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume text here..."
                    sx={{ mb: 3 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                    onClick={handleGenerate}
                    disabled={!selectedApp || !jobDescription.trim() || !resumeText.trim() || isLoading}
                    sx={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                      },
                    }}
                  >
                    {isLoading ? 'Generating...' : 'Generate Cover Letter'}
                  </Button>

                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Output */}
            <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
              <Card sx={{ 
                height: '100%', 
                minHeight: 500,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box
                    sx={{
                      p: 3,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Article sx={{ color: '#22d3ee' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#f8fafc' }}>
                        Generated Cover Letter
                      </Typography>
                    </Box>
                    {coverLetter && (
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={handleCopy} title="Copy to clipboard" sx={{ color: '#94a3b8' }}>
                          <ContentCopy fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={handleDownload} title="Download" sx={{ color: '#94a3b8' }}>
                          <Download fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={handleGenerate} title="Regenerate" sx={{ color: '#94a3b8' }}>
                          <Refresh fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
                    {copied && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Copied to clipboard!
                      </Alert>
                    )}

                    {isLoading ? (
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CircularProgress sx={{ mb: 2, color: '#06b6d4' }} />
                        <Typography sx={{ color: '#94a3b8' }}>Generating your cover letter...</Typography>
                      </Box>
                    ) : coverLetter ? (
                      <Typography
                        variant="body1"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.8,
                          fontFamily: 'Georgia, serif',
                          color: '#e2e8f0',
                        }}
                      >
                        {coverLetter}
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748b',
                        }}
                      >
                        <Article sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                        <Typography variant="body1" sx={{ textAlign: 'center', color: '#94a3b8' }}>
                          Select an application and click generate
                          <br />
                          to create a tailored cover letter
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ProfessionalLayout>
  );
};

export default CoverLetters;
