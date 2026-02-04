import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/userService';

const initialState = {
  profile: null,
  resumes: [],
  coverLetters: [],
  isLoading: false,
  error: null,
  updateSuccess: false,
};

// Get user profile
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, thunkAPI) => {
    try {
      const response = await userService.getProfile();
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

// Update user profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      const response = await userService.updateProfile(profileData);
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

// Upload profile image
export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (imageFile, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('profileImage', imageFile);
      const response = await userService.uploadProfileImage(formData);
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

// Upload resume
export const uploadResume = createAsyncThunk(
  'user/uploadResume',
  async ({ resumeFile, metadata }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('title', metadata.title);
      formData.append('targetRole', metadata.targetRole);
      formData.append('isPrimary', metadata.isPrimary);
      const response = await userService.uploadResume(formData);
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

// Get resumes
export const getResumes = createAsyncThunk(
  'user/getResumes',
  async (_, thunkAPI) => {
    try {
      const response = await userService.getResumes();
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

// Delete resume
export const deleteResume = createAsyncThunk(
  'user/deleteResume',
  async (resumeId, thunkAPI) => {
    try {
      await userService.deleteResume(resumeId);
      return { resumeId };
    } catch (error) {
      const message = 
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Save cover letter
export const saveCoverLetter = createAsyncThunk(
  'user/saveCoverLetter',
  async (coverLetterData, thunkAPI) => {
    try {
      const response = await userService.saveCoverLetter(coverLetterData);
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

// Get cover letters
export const getCoverLetters = createAsyncThunk(
  'user/getCoverLetters',
  async (_, thunkAPI) => {
    try {
      const response = await userService.getCoverLetters();
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.updateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.updateSuccess = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.updateSuccess = false;
      })
      // Upload Profile Image
      .addCase(uploadProfileImage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.updateSuccess = true;
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Upload Resume
      .addCase(uploadResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = [action.payload, ...state.resumes];
        state.updateSuccess = true;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Resumes
      .addCase(getResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = action.payload;
      })
      .addCase(getResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Resume
      .addCase(deleteResume.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resumes = state.resumes.filter(r => r._id !== action.payload.resumeId);
        state.updateSuccess = true;
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Save Cover Letter
      .addCase(saveCoverLetter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveCoverLetter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coverLetters = [action.payload, ...state.coverLetters];
        state.updateSuccess = true;
      })
      .addCase(saveCoverLetter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Cover Letters
      .addCase(getCoverLetters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCoverLetters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coverLetters = action.payload;
      })
      .addCase(getCoverLetters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
