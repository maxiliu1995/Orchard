'use client';

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from '@/utils/storage';
import { api } from './api';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import { errorMiddleware } from './middleware/errorMiddleware';
import { preferencesSlice } from './slices/preferencesSlice';
import { rootReducer } from './reducers';
import { authApi } from './authApi';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['session', 'preferences'],
  blacklist: [api.reducerPath, authApi.reducerPath], // Don't persist API states
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    ...persistedReducer,
    [api.reducerPath]: api.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .concat(api.middleware)
    .concat(authApi.middleware)
    .concat(errorMiddleware),
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);

// Add this debug code
store.subscribe(() => {
  console.log('Store state updated:', {
    state: store.getState(),
    reducerPaths: Object.keys(store.getState()),
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 