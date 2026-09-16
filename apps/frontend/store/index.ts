import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import resumeReducer from '@/lib/store/features/resume-slice';
import coverLetterReducer from '@/lib/store/features/cover-letter-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resume: resumeReducer,
    coverLetter: coverLetterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
