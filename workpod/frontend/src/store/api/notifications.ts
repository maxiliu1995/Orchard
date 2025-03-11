import { api } from '../api';
import { Notification } from '@/types/api.types';
import { NotificationPreferences } from '@/types/notification.types';
import { createApi } from '@reduxjs/toolkit/query/react';

export const notificationsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),

    getPreferences: build.query<NotificationPreferences, void>({
      query: () => '/notifications/preferences',
      providesTags: ['Notification'],
    }),

    markAsRead: build.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notification'],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          notificationsApi.util.updateQueryData('getNotifications', undefined, (draft) => {
            const notification = draft.find(n => n.id === id);
            if (notification) {
              notification.read = true;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    updatePreferences: build.mutation<void, NotificationPreferences>({
      query: (preferences: NotificationPreferences) => ({
        url: '/notifications/preferences',
        method: 'PUT',
        body: preferences,
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetPreferencesQuery,
  useMarkAsReadMutation,
  useUpdatePreferencesMutation,
} = notificationsApi; 