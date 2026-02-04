import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as aiService from '../services/aiService';

const initialState = {
  resumeAnalysis: null,
  coverLetter: null,
  successPrediction: null,
  applicationInsights: null,
  interviewGuidance: null,
  isLoading: false,
  error: null,
};

export const analyzeResumePDF = createAsyncThunk(
  'ai/analyzeResumePDF',
  async ({ file, jobDescription, targetRole }, thunkAPI) => {
    try {
      const response = await aiService.analyzeResumePDF(file, jobDescription, targetRole);
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

export const analyzeResumeText = createAsyncThunk(
  'ai/analyzeResumeText',
  async ({ resumeText, jobDescription, targetRole }, thunkAPI) => {
    try {
      const response = await aiService.analyzeResumeText(resumeText, jobDescription, targetRole);
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

export const analyzeResume = createAsyncThunk(
  'ai/analyzeResume',
  async ({ resumeData, jobDescription, jobRole }, thunkAPI) => {
    try {
      const response = await aiService.analyzeResume(resumeData, jobDescription, jobRole);
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

export const generateCoverLetter = createAsyncThunk(
  'ai/generateCoverLetter',
  async ({ resumeData, jobDescription, jobRole }, thunkAPI) => {
    try {
      const response = await aiService.generateCoverLetter(resumeData, jobDescription, jobRole);
      return response.coverLetter || response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const predictSuccess = createAsyncThunk(
  'ai/predictSuccess',
  async ({ applicationId, jobDescription }, thunkAPI) => {
    try {
      const response = await aiService.predictSuccessProbability(applicationId, jobDescription);
      return response.prediction || response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchApplicationInsights = createAsyncThunk(
  'ai/fetchApplicationInsights',
  async (_, thunkAPI) => {
    try {
      const response = await aiService.getApplicationInsights();
      return response.insights || response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchInterviewGuidance = createAsyncThunk(
  'ai/fetchInterviewGuidance',
  async ({ company, jobDescription }, thunkAPI) => {
    try {
      const response = await aiService.getInterviewGuidance(company, jobDescription);
      return response.guidance || response;
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
      state.coverLetter = null;
      state.successPrediction = null;
      state.applicationInsights = null;
      state.interviewGuidance = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeResumePDF.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeResumePDF.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumeAnalysis = action.payload;
      })
      .addCase(analyzeResumePDF.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(analyzeResumeText.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(analyzeResumeText.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumeAnalysis = action.payload;
      })
      .addCase(analyzeResumeText.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
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
      .addCase(predictSuccess.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(predictSuccess.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successPrediction = action.payload;
      })
      .addCase(predictSuccess.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchApplicationInsights.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplicationInsights.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applicationInsights = action.payload;
      })
      .addCase(fetchApplicationInsights.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchInterviewGuidance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInterviewGuidance.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interviewGuidance = action.payload;
      })
      .addCase(fetchInterviewGuidance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset } = aiSlice.actions;
export default aiSlice.reducer;
