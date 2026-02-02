import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import userSlice from './userSlice';
import applicationsSlice from './applicationsSlice';
import aiSlice from './aiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    applications: applicationsSlice,
    ai: aiSlice,
  },
});
