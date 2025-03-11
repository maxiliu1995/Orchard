import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  token: string | null;
  expiresAt: string | null;
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState: { token: null, expiresAt: null } as SessionState,
  reducers: {
    setSession: (state, action: PayloadAction<SessionState>) => {
      state.token = action.payload.token;
      state.expiresAt = action.payload.expiresAt;
    },
    clearSession: (state) => {
      state.token = null;
      state.expiresAt = null;
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer; 