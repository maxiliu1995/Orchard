import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Pod, Booking, PodStatus } from '@/types/api.types';

interface PodStats {
  totalBookings: number;
  occupancyRate: number;
  averageBookingDuration: number;
  revenue: number;
}

interface SearchParams {
  latitude?: number;
  longitude?: number;
  radius?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: string[];
}

export const podsApi = createApi({
  reducerPath: 'podsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Pod', 'Booking'],
  endpoints: (builder) => ({
    getPods: builder.query<Pod[], { latitude: number; longitude: number; radius: number }>({
      query: (params) => ({
        url: '/pods',
        params,
      }),
      providesTags: [{ type: 'Pod', id: 'LIST' }],
    }),

    getPod: builder.query<Pod, string>({
      query: (podId) => `/pods/${podId}`,
      providesTags: ['Pod'],
    }),

    getPodAvailability: builder.query<
      { available: boolean; nextAvailable?: string },
      { podId: string; startTime: string; endTime: string }
    >({
      query: (params) => ({
        url: `/pods/${params.podId}/availability`,
        params: { startTime: params.startTime, endTime: params.endTime },
      }),
    }),

    reservePod: builder.mutation<
      { bookingId: string },
      { podId: string; startTime: string; endTime: string }
    >({
      query: (data) => ({
        url: `/pods/${data.podId}/reserve`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Pod'],
    }),

    createBooking: builder.mutation<Booking, { podId: string; startTime: string; endTime: string }>({
      query: (data) => ({
        url: '/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Pod', 'Booking'],
    }),

    startMaintenance: builder.mutation<void, string>({
      query: (podId) => ({
        url: `/pods/${podId}/maintenance/start`,
        method: 'POST',
      }),
      invalidatesTags: ['Pod'],
    }),

    completeMaintenance: builder.mutation<void, string>({
      query: (podId) => ({
        url: `/pods/${podId}/maintenance/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['Pod'],
    }),

    getMaintenanceHistory: builder.query<
      Array<{ date: string; description: string }>,
      string
    >({
      query: (podId) => `/pods/${podId}/maintenance/history`,
    }),

    getPodStatus: builder.query<{ status: PodStatus; lastUpdated: string }, string>({
      query: (podId) => `/pods/${podId}/status`,
      providesTags: ['Pod'],
    }),

    updatePodStatus: builder.mutation<void, { podId: string; status: PodStatus }>({
      query: ({ podId, status }) => ({
        url: `/pods/${podId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Pod'],
    }),

    getPodStats: builder.query<PodStats, { podId: string; period: 'day' | 'week' | 'month' }>({
      query: ({ podId, period }) => `/pods/${podId}/stats?period=${period}`,
    }),

    getPodHealth: builder.query<{
      online: boolean;
      batteryLevel: number;
      temperature: number;
      lastHealthCheck: string;
    }, string>({
      query: (podId) => `/pods/${podId}/health`,
    }),

    searchPods: builder.query<Pod[], SearchParams>({
      query: (params) => ({
        url: '/pods/search',
        params,
      }),
      providesTags: ['Pod'],
    }),

    getPodDetails: builder.query<Pod, string>({
      query: (id) => `/pods/${id}`,
      providesTags: (result, error, id) => [{ type: 'Pod', id }],
    }),
  }),
});

export const {
  useGetPodsQuery,
  useGetPodQuery,
  useGetPodAvailabilityQuery,
  useReservePodMutation,
  useCreateBookingMutation,
  useGetPodStatusQuery,
  useUpdatePodStatusMutation,
  useGetPodStatsQuery,
  useGetPodHealthQuery,
  useSearchPodsQuery,
  useGetPodDetailsQuery,
} = podsApi; 