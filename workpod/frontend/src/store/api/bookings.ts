import { api } from '../api';
import { Booking, BookingStatus } from '@/types/api.types';

export const bookingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => '/bookings',
      providesTags: ['Booking'],
    }),

    getBooking: builder.query<Booking, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: ['Booking'],
    }),

    cancelBooking: builder.mutation<void, string>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Booking', 'Pod'],
    }),

    extendBooking: builder.mutation<
      Booking,
      { bookingId: string; endTime: string }
    >({
      query: ({ bookingId, endTime }) => ({
        url: `/bookings/${bookingId}/extend`,
        method: 'POST',
        body: { endTime },
      }),
      invalidatesTags: ['Booking'],
    }),

    getBookingHistory: builder.query<
      Booking[],
      { status?: BookingStatus; startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: '/bookings/history',
        params,
      }),
      providesTags: ['Booking'],
    }),

    getBookingStats: builder.query<{
      totalBookings: number;
      totalSpent: number;
      averageDuration: number;
      favoriteLocation: string;
    }, void>({
      query: () => '/bookings/stats',
    }),

    createBooking: builder.mutation<Booking, {
      podId: string;
      startTime: string;
      endTime: string;
    }>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking', 'Pod'],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetBookingsQuery,
  useGetBookingQuery,
  useCancelBookingMutation,
  useExtendBookingMutation,
  useGetBookingHistoryQuery,
  useGetBookingStatsQuery,
} = bookingsApi; 