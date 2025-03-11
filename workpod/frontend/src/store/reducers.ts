import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookingReducer from './slices/bookingSlice';
import { preferencesSlice } from './slices/preferencesSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  preferences: preferencesSlice.reducer,
  // Note: Don't include API reducers here, they're added in store config
});

export type RootState = ReturnType<typeof rootReducer>; 