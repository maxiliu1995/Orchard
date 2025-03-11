import { api } from '../api';
import { User, Pod, Booking } from '@/types/api.types';

interface DashboardStats {
  totalUsers: number;
  totalPods: number;
  activeBookings: number;
  revenue: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  occupancyRate: number;
}

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/admin/dashboard/stats',
    }),

    getUsers: builder.query<User[], void>({
      query: () => '/admin/users',
      providesTags: ['User'],
    }),

    updateUserStatus: builder.mutation<void, { userId: string; active: boolean }>({
      query: (data) => ({
        url: `/admin/users/${data.userId}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    getSystemHealth: builder.query<{
      services: Array<{ name: string; status: 'healthy' | 'degraded' | 'down' }>;
      lastCheck: string;
    }, void>({
      query: () => '/admin/system/health',
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useGetSystemHealthQuery,
} = adminApi; 