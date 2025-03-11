import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type { User, Booking, Pod, Notification } from '@/types/api.types';
import { RootState } from '@/store/store';

// Define the base API types
export type ApiEndpoints = {
  Booking: any;
  Notification: any;
  Pod: any;
  AccessCode: any;
  User: any;
  PaymentMethods: any;
  PaymentAnalytics: any;
}

// Create a custom base query with retries
const baseQueryWithRetry = retry(
  fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).session.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    // Add timeout
    timeout: 10000,
  }),
  { maxRetries: 3 }
);

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['User', 'Pod', 'Booking', 'Notification'],
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
    }),
    getPods: builder.query<Pod[], void>({
      query: () => '/pods',
    }),
    getBookings: builder.query<Booking[], void>({
      query: () => '/bookings',
    }),
    login: builder.mutation<{ token: string; user: User }, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
  keepUnusedDataFor: 300, // Cache for 5 minutes
});

// Add cache configuration
export const rtkQueryMiddleware = api.middleware;

export const {
  useGetNotificationsQuery,
  useGetPodsQuery,
  useGetBookingsQuery,
  useLoginMutation,
  useLogoutMutation,
} = api; 