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
  CircularProgress,
  Alert,
  Divider,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Analytics,
  AutoAwesome,
  CheckCircle,
  Warning,
  TipsAndUpdates,
  Speed,
  WorkspacePremium,
  ContentPaste,
  UploadFile,
} from '@mui/icons-material';
import { analyzeResumePDF, analyzeResumeText } from '../store/aiSlice';
import ProfessionalLayout from '../components/ProfessionalLayout';

const ResumeAnalyzer = () => {
  const dispatch = useDispatch();
  const { resumeAnalysis, isLoading, error } = useSelector((state) => state.ai);

  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const handleAnalyze = () => {
    if (!jobDescription.trim()) return;

    if (resumeFile) {
      dispatch(analyzeResumePDF({ file: resumeFile, jobDescription, targetRole: targetRole || 'General' }));
      return;
    }

    if (resumeText.trim()) {
      dispatch(analyzeResumeText({ resumeText, jobDescription, targetRole: targetRole || 'General' }));
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setResumeText(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  const formatPresentationScore =
    resumeAnalysis?.scoreBreakdown?.formatAndPresentation !== undefined
      ? `${resumeAnalysis.scoreBreakdown.formatAndPresentation}%`
      : 'N/A';

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
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                }}
              >
                <Analytics />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a' }}>
                  Resume Analyzer
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748b' }}>
                  Get AI-powered insights and scoring for your resume
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
                    <AutoAwesome sx={{ color: '#6366f1' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Paste Your Resume
                    </Typography>
                  </Box>

                  <Divider sx={{ mb: 3 }} />

                  <TextField
                    fullWidth
                    label="Target Role (Optional)"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="e.g., Software Engineer, Product Manager"
                    sx={{ mb: 3 }}
                  />

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
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFile />}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {resumeFile ? `PDF Selected: ${resumeFile.name}` : 'Upload Resume PDF (Optional)'}
                    <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
                  </Button>

                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={12}
                      label="Resume Content"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume content here if not uploading PDF..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                        },
                      }}
                    />
                    <Button
                      size="small"
                      startIcon={<ContentPaste />}
                      onClick={handlePaste}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: '#f1f5f9',
                        color: '#64748b',
                        '&:hover': { bgcolor: '#e2e8f0' },
                      }}
                    >
                      Paste
                    </Button>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Analytics />}
                    onClick={handleAnalyze}
                    disabled={(!resumeText.trim() && !resumeFile) || !jobDescription.trim() || isLoading}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    }}
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Resume'}
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
              {resumeAnalysis ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                  {/* Overall Score Card */}
                  <Card
                    sx={{
                      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                      color: '#fff',
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                          <Box sx={{ textAlign: 'center' }}>
                            <Box
                              sx={{
                                width: 140,
                                height: 140,
                                borderRadius: '50%',
                                background: `conic-gradient(${getScoreColor(resumeAnalysis.overallScore)} ${resumeAnalysis.overallScore * 3.6}deg, rgba(255,255,255,0.2) 0deg)`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 120,
                                  height: 120,
                                  borderRadius: '50%',
                                  bgcolor: '#1e1b4b',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                  {resumeAnalysis.overallScore}
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                  out of 100
                                </Typography>
                              </Box>
                            </Box>
                            <Chip
                              label={getScoreLabel(resumeAnalysis.overallScore)}
                              sx={{
                                bgcolor: getScoreColor(resumeAnalysis.overallScore),
                                color: '#fff',
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Score Breakdown
                          </Typography>
                          <Grid container spacing={2}>
                            {resumeAnalysis.scoreBreakdown &&
                              Object.entries(resumeAnalysis.scoreBreakdown).map(([section, score]) => (
                                <Grid item xs={6} key={section}>
                                  <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                        {section.replace(/([A-Z])/g, ' $1')}
                                      </Typography>
                                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {score}%
                                      </Typography>
                                    </Box>
                                    <LinearProgress
                                      variant="determinate"
                                      value={score}
                                      sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        bgcolor: 'rgba(255,255,255,0.2)',
                                        '& .MuiLinearProgress-bar': {
                                          bgcolor: getScoreColor(score),
                                          borderRadius: 3,
                                        },
                                      }}
                                    />
                                  </Box>
                                </Grid>
                              ))}
                          </Grid>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                            <Speed />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Format & Presentation
                              </Typography>
                              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                {formatPresentationScore}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>

                  {/* Summary */}
                  {resumeAnalysis.summary && (
                    <Card>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                          <WorkspacePremium sx={{ color: '#6366f1' }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Summary
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7 }}>
                          {resumeAnalysis.summary}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                  {/* Strengths & Improvements */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <CheckCircle sx={{ color: '#10b981' }} />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              Strengths
                            </Typography>
                          </Box>
                          <List dense>
                            {resumeAnalysis.strengths?.map((strength, idx) => (
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
                              Areas to Improve
                            </Typography>
                          </Box>
                          <List dense>
                            {resumeAnalysis.weaknesses?.map((improvement, idx) => (
                              <ListItem key={idx} sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Warning sx={{ color: '#f59e0b', fontSize: 18 }} />
                                </ListItemIcon>
                                <ListItemText primary={improvement} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Suggestions */}
                  <Card>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <TipsAndUpdates sx={{ color: '#6366f1' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Actionable Suggestions
                        </Typography>
                      </Box>
                      <List dense>
                        {resumeAnalysis.suggestions?.map((suggestion, idx) => (
                          <ListItem key={idx} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <TipsAndUpdates sx={{ color: '#6366f1', fontSize: 18 }} />
                            </ListItemIcon>
                            <ListItemText primary={suggestion} />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>

                  {/* Missing Keywords */}
                  {resumeAnalysis.missingKeywords?.length > 0 && (
                    <Card>
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          Suggested Keywords to Add
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {resumeAnalysis.missingKeywords.map((keyword, idx) => (
                            <Chip
                              key={idx}
                              label={keyword}
                              sx={{
                                bgcolor: '#ede9fe',
                                color: '#6366f1',
                                fontWeight: 500,
                              }}
                            />
                          ))}
                        </Box>
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
                      <Analytics sx={{ fontSize: 40, color: '#94a3b8' }} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: '#0f172a' }}>
                      Ready to Analyze
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 400 }}>
                      Paste your resume content on the left and click "Analyze Resume" to get comprehensive insights, scoring, and improvement suggestions.
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

export default ResumeAnalyzer;
