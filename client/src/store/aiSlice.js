import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiService from '../services/aiService';

const initialState = {
  resumeAnalysis: null,
  optimizedResume: null,
  coverLetter: null,
  interviewQuestions: null,
  interviewFeedback: null,
  successAnalysis: null,
  isLoading: false,
  error: null,
};

// Analyze resume
export const analyzeResume = createAsyncThunk(
  'ai/analyzeResume',
  async ({ resumeText, targetRole }, thunkAPI) => {
    try {
      const response = await aiService.analyzeResume(resumeText, targetRole);
      return response.analysis || response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Optimize resume
export const optimizeResume = createAsyncThunk(
  'ai/optimizeResume',
  async ({ resumeText, jobDescription }, thunkAPI) => {
    try {
      const response = await aiService.optimizeResume(resumeText, jobDescription);
      return response.data || response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Generate cover letter
export const generateCoverLetter = createAsyncThunk(
  'ai/generateCoverLetter',
  async ({ company, position, additionalInfo }, thunkAPI) => {
    try {
      const response = await aiService.generateCoverLetter({
        company,
        position,
        additionalInfo,
      });
      return response.data || response.coverLetter || response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Generate interview questions
export const generateInterviewQuestions = createAsyncThunk(
  'ai/generateInterviewQuestions',
  async ({ company, position, questionType }, thunkAPI) => {
    try {
      const response = await aiService.generateInterviewQuestions({
        company,
        role: position,
        questionType,
      });
      // Handle different response formats
      if (response.questions) return response.questions;
      if (response.data) return response.data;
      if (Array.isArray(response)) return response;
      return response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get interview feedback
export const getInterviewFeedback = createAsyncThunk(
  'ai/getInterviewFeedback',
  async ({ question, answer }, thunkAPI) => {
    try {
      const response = await aiService.getInterviewFeedback({
        question,
        answer,
      });
      return response.feedback || response.data || response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Predict interview questions (legacy)
export const predictInterviewQuestions = createAsyncThunk(
  'ai/predictInterviewQuestions',
  async ({ jobDescription }, thunkAPI) => {
    try {
      const response = await aiService.predictInterviewQuestions(jobDescription);
      return response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Analyze success probability
export const analyzeSuccessProbability = createAsyncThunk(
  'ai/analyzeSuccessProbability',
  async ({ profileData, jobDescription }, thunkAPI) => {
    try {
      const response = await aiService.analyzeSuccessProbability(profileData, jobDescription);
      return response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.resumeAnalysis = null;
      state.optimizedResume = null;
      state.coverLetter = null;
      state.interviewQuestions = null;
      state.interviewFeedback = null;
      state.successAnalysis = null;
    },
    clearResults: (state) => {
      state.resumeAnalysis = null;
      state.optimizedResume = null;
      state.coverLetter = null;
      state.interviewQuestions = null;
      state.interviewFeedback = null;
      state.successAnalysis = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Analyze Resume
      .addCase(analyzeResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumeAnalysis = action.payload;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Optimize Resume
      .addCase(optimizeResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(optimizeResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.optimizedResume = action.payload;
      })
      .addCase(optimizeResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Generate Cover Letter
      .addCase(generateCoverLetter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateCoverLetter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coverLetter = action.payload;
      })
      .addCase(generateCoverLetter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Generate Interview Questions
      .addCase(generateInterviewQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.interviewQuestions = null;
        state.interviewFeedback = null;
      })
      .addCase(generateInterviewQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interviewQuestions = action.payload;
      })
      .addCase(generateInterviewQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Interview Feedback
      .addCase(getInterviewFeedback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getInterviewFeedback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interviewFeedback = action.payload;
      })
      .addCase(getInterviewFeedback.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Predict Interview Questions (legacy)
      .addCase(predictInterviewQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(predictInterviewQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interviewQuestions = action.payload;
      })
      .addCase(predictInterviewQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Analyze Success Probability
      .addCase(analyzeSuccessProbability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeSuccessProbability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successAnalysis = action.payload;
      })
      .addCase(analyzeSuccessProbability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, clearResults } = aiSlice.actions;
export default aiSlice.reducer;
