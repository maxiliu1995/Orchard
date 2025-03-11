import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '@/types/api.types';

interface Session {
  id: string;
  token: string;
  expiresAt: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

interface CreateAccountRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface CreateAccountResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.178.28:3001/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Auth'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json');
      console.log('Making request to:', API_URL);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => {
        console.log('Register endpoint URL:', `${API_URL}/auth/register`);
        return {
          url: '/auth/register',
          method: 'POST',
          body: data,
        };
      },
    }),
    refreshSession: builder.mutation<Session, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
    }),
    revokeSession: builder.mutation<void, string>({
      query: (sessionId) => ({
        url: `/auth/sessions/${sessionId}`,
        method: 'DELETE',
      }),
    }),
    requestPasswordReset: builder.mutation<void, string>({
      query: (email) => ({
        url: '/auth/password-reset/request',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),
    validateResetToken: builder.query<
      { valid: boolean }, 
      string
    >({
      query: (token) => `/auth/password-reset/validate/${token}`,
    }),
    verifyEmail: builder.mutation<void, string>({
      query: (token) => ({
        url: `/auth/verify-email/${token}`,
        method: 'POST',
      }),
    }),
    resendVerificationEmail: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/verify-email/resend',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshSessionMutation,
  useRevokeSessionMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useValidateResetTokenQuery,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
} = authApi;

export const { middleware: authApiMiddleware, reducer: authApiReducer } = authApi; 