'use client';

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './api/auth';

// Create the store with middleware
export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  // Explicitly add the middleware
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();
    return middleware.concat(authApi.middleware);
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// Optional: Log store creation for debugging
if (process.env.NODE_ENV !== 'production') {
  console.log('Store created with reducers:', {
    reducerPaths: Object.keys(store.getState()),
    middleware: 'Added RTK Query middleware'
  });
}

// Setup listeners conditionally
if (typeof window !== 'undefined') {
  setupListeners(store.dispatch);
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 