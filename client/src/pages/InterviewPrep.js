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
  IconButton,
  Paper,
} from '@mui/material';
import {
  Psychology,
  AutoAwesome,
  Send,
  Refresh,
  RecordVoiceOver,
  QuestionAnswer,
  TipsAndUpdates,
} from '@mui/icons-material';
import { generateInterviewQuestions, getInterviewFeedback } from '../store/aiSlice';
import ProfessionalLayout from '../components/ProfessionalLayout';

const InterviewPrep = () => {
  const dispatch = useDispatch();
  const { applications } = useSelector((state) => state.applications);
  const { interviewQuestions, interviewFeedback, isLoading, error } = useSelector((state) => state.ai);

  const [selectedApp, setSelectedApp] = useState('');
  const [questionType, setQuestionType] = useState('behavioral');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const questionTypes = [
    { value: 'behavioral', label: 'Behavioral', icon: <RecordVoiceOver /> },
    { value: 'technical', label: 'Technical', icon: <Psychology /> },
    { value: 'situational', label: 'Situational', icon: <QuestionAnswer /> },
  ];

  const handleGenerateQuestions = () => {
    const application = applications.find((app) => app._id === selectedApp);
    if (application) {
      dispatch(
        generateInterviewQuestions({
          company: application.company,
          position: application.position,
          questionType,
        })
      );
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setShowFeedback(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (userAnswer.trim() && interviewQuestions?.[currentQuestionIndex]) {
      dispatch(
        getInterviewFeedback({
          question: interviewQuestions[currentQuestionIndex],
          answer: userAnswer,
        })
      );
      setShowFeedback(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (interviewQuestions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
    }
  };

  const currentQuestion = interviewQuestions?.[currentQuestionIndex];

  return (
    <ProfessionalLayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f8fafc' }}>
              Interview Prep
            </Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8' }}>
              Practice with AI-generated interview questions and get feedback
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Setup Panel */}
            <Grid item xs={12} md={4}>
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

                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1.5, color: '#e2e8f0' }}>
                    Question Type
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                    {questionTypes.map((type) => (
                      <Chip
                        key={type.value}
                        label={type.label}
                        icon={type.icon}
                        onClick={() => setQuestionType(type.value)}
                        sx={{
                          bgcolor: questionType === type.value ? 'rgba(6, 182, 212, 0.9)' : 'rgba(30, 41, 59, 0.8)',
                          color: questionType === type.value ? '#fff' : '#94a3b8',
                          border: '1px solid',
                          borderColor: questionType === type.value ? '#06b6d4' : 'rgba(148, 163, 184, 0.2)',
                          '& .MuiChip-icon': {
                            color: questionType === type.value ? '#fff' : '#94a3b8',
                          },
                          '&:hover': {
                            bgcolor: questionType === type.value ? 'rgba(6, 182, 212, 1)' : 'rgba(51, 65, 85, 0.8)',
                          },
                        }}
                      />
                    ))}
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                    onClick={handleGenerateQuestions}
                    disabled={!selectedApp || isLoading}
                    sx={{
                      background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                      },
                    }}
                  >
                    {isLoading ? 'Generating...' : 'Generate Questions'}
                  </Button>

                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {interviewQuestions && interviewQuestions.length > 0 && (
                <Card sx={{ 
                  mt: 3,
                  background: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 2, color: '#e2e8f0' }}>
                      Progress
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {interviewQuestions.map((_, index) => (
                        <Box
                          key={index}
                          onClick={() => {
                            setCurrentQuestionIndex(index);
                            setUserAnswer('');
                            setShowFeedback(false);
                          }}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: 14,
                            bgcolor: currentQuestionIndex === index ? '#06b6d4' : 'rgba(30, 41, 59, 0.8)',
                            color: currentQuestionIndex === index ? '#fff' : '#94a3b8',
                            border: '1px solid',
                            borderColor: currentQuestionIndex === index ? '#06b6d4' : 'rgba(148, 163, 184, 0.2)',
                            '&:hover': {
                              bgcolor: currentQuestionIndex === index ? '#0891b2' : 'rgba(51, 65, 85, 0.8)',
                            },
                          }}
                        >
                          {index + 1}
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Practice Area */}
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                minHeight: 500,
                background: 'rgba(30, 41, 59, 0.5)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(148, 163, 184, 0.1)',
              }}>
                <CardContent sx={{ p: 0, height: '100%' }}>
                  {!interviewQuestions || interviewQuestions.length === 0 ? (
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
                        Ready to Practice?
                      </Typography>
                      <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748b' }}>
                        Select an application and generate questions to start your practice session
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      {/* Question */}
                      <Box sx={{ p: 4, borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Chip
                            label={`Question ${currentQuestionIndex + 1} of ${interviewQuestions.length}`}
                            size="small"
                            sx={{ 
                              bgcolor: 'rgba(6, 182, 212, 0.15)', 
                              color: '#22d3ee',
                              border: '1px solid rgba(6, 182, 212, 0.3)',
                            }}
                          />
                          <IconButton size="small" onClick={handleGenerateQuestions} sx={{ color: '#94a3b8' }}>
                            <Refresh />
                          </IconButton>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 500, lineHeight: 1.6, color: '#f8fafc' }}>
                          {currentQuestion}
                        </Typography>
                      </Box>

                      {/* Answer Area */}
                      <Box sx={{ p: 4 }}>
                        <TextField
                          fullWidth
                          multiline
                          rows={5}
                          label="Your Answer"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Type your answer here..."
                          disabled={showFeedback}
                          sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                          {!showFeedback ? (
                            <Button
                              variant="contained"
                              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                              onClick={handleSubmitAnswer}
                              disabled={!userAnswer.trim() || isLoading}
                              sx={{
                                background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                                },
                              }}
                            >
                              {isLoading ? 'Getting Feedback...' : 'Submit Answer'}
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              onClick={handleNextQuestion}
                              disabled={currentQuestionIndex >= interviewQuestions.length - 1}
                              sx={{
                                background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)',
                                },
                              }}
                            >
                              Next Question
                            </Button>
                          )}
                        </Box>

                        {/* Feedback */}
                        {showFeedback && interviewFeedback && (
                          <Paper
                            sx={{
                              mt: 3,
                              p: 3,
                              bgcolor: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <TipsAndUpdates sx={{ color: '#10b981' }} />
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#10b981' }}>
                                AI Feedback
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: '#e2e8f0' }}>
                              {interviewFeedback}
                            </Typography>
                          </Paper>
                        )}
                      </Box>
                    </>
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
