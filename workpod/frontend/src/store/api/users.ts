import { api } from '../api';
import { User, UserPreferences } from '@/types/api.types';

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: '/users/profile',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    updatePreferences: builder.mutation<UserPreferences, Partial<UserPreferences>>({
      query: (data) => ({
        url: '/users/preferences',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    changePassword: builder.mutation<void, { currentPassword: string; newPassword: string }>({
      query: (data) => ({
        url: '/users/password',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePreferencesMutation,
  useChangePasswordMutation,
} = usersApi; 