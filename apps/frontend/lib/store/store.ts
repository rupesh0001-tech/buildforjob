import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './features/resume-slice';
import coverLetterReducer from './features/cover-letter-slice';

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    coverLetter: coverLetterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
