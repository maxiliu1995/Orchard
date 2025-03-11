import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Pod, Notification, Booking } from '@/types/api.types';

// Define types for better type safety
interface CreateAccountRequest {
  email: string;
  password: string;
  // ... other fields
}

interface CreateAccountResponse {
  id: string;
  email: string;
  // ... other fields
}

export type ApiEndpoints = {
  getPods: Pod[];
  getNotifications: Notification[];
  getBookings: Booking[];
};

export type EndpointName = keyof ApiEndpoints;

// Create the API with explicit types
export const api = createApi({
  reducerPath: 'api', // This must match exactly in the store
  tagTypes: ['Pod'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createAccount: builder.mutation<CreateAccountResponse, CreateAccountRequest>({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    getPods: builder.query<ApiEndpoints['getPods'], void>({ query: () => 'pods' }),
    getNotifications: builder.query<ApiEndpoints['getNotifications'], void>({ query: () => 'notifications' }),
    getBookings: builder.query<ApiEndpoints['getBookings'], void>({ query: () => 'bookings' }),
  }),
});

// Export hooks and reducer
export const { useCreateAccountMutation, useGetPodsQuery, useGetNotificationsQuery, useGetBookingsQuery } = api;
export const apiReducer = api.reducer;
export const apiMiddleware = api.middleware; 