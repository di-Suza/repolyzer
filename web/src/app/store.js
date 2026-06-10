import { configureStore } from '@reduxjs/toolkit';
import { githubApi } from '../features/github/githubApi';
import githubReducer from '../features/github/githubSlice';

export const store = configureStore({
  reducer: {
    [githubApi.reducerPath]: githubApi.reducer,
    github: githubReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(githubApi.middleware),
});