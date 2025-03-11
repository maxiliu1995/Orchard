import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  mapSettings: {
    defaultZoom: number;
    defaultRadius: number;
  };
  language: string;
}

const initialState: PreferencesState = {
  theme: 'light',
  notifications: {
    email: true,
    push: true,
    desktop: true,
  },
  mapSettings: {
    defaultZoom: 13,
    defaultRadius: 5000,
  },
  language: 'en',
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<PreferencesState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateMapSettings: (state, action: PayloadAction<Partial<PreferencesState['mapSettings']>>) => {
      state.mapSettings = { ...state.mapSettings, ...action.payload };
    },
  },
}); 