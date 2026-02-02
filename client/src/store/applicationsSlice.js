import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from '../services/applicationService';

const initialState = {
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

// Get all applications
export const getApplications = createAsyncThunk(
  'applications/getApplications',
  async (_, thunkAPI) => {
    try {
      const response = await applicationService.getApplications();
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

// Get single application
export const getApplication = createAsyncThunk(
  'applications/getApplication',
  async (id, thunkAPI) => {
    try {
      const response = await applicationService.getApplication(id);
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

// Create application
export const createApplication = createAsyncThunk(
  'applications/createApplication',
  async (applicationData, thunkAPI) => {
    try {
      const response = await applicationService.createApplication(applicationData);
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

// Update application
export const updateApplication = createAsyncThunk(
  'applications/updateApplication',
  async ({ id, applicationData }, thunkAPI) => {
    try {
      const response = await applicationService.updateApplication(id, applicationData);
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

// Delete application
export const deleteApplication = createAsyncThunk(
  'applications/deleteApplication',
  async (id, thunkAPI) => {
    try {
      const response = await applicationService.deleteApplication(id);
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

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
      state.currentApplication = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Applications
      .addCase(getApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload;
      })
      .addCase(getApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Application
      .addCase(getApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentApplication = action.payload;
      })
      .addCase(getApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Application
      .addCase(createApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.createSuccess = false;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.unshift(action.payload);
        state.createSuccess = true;
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.createSuccess = false;
      })
      // Update Application
      .addCase(updateApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = state.applications.map(app =>
          app._id === action.payload._id ? action.payload : app
        );
        state.currentApplication = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      // Delete Application
      .addCase(deleteApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = state.applications.filter(app => app._id !== action.payload.id);
        state.deleteSuccess = true;
      })
      .addCase(deleteApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.deleteSuccess = false;
      });
  },
});

export const { reset, clearCurrentApplication } = applicationsSlice.actions;
export default applicationsSlice.reducer;
