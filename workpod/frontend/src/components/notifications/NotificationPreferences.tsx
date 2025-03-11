'use client';

import { useState } from 'react';
import { useGetNotificationsQuery, useUpdatePreferencesMutation, useGetPreferencesQuery } from '@/store/api/notifications';
import type { NotificationPreferences } from '@/types/notification.types';

export function NotificationPreferences() {
  const { data: preferences, isLoading } = useGetPreferencesQuery();
  const [updatePreferences] = useUpdatePreferencesMutation();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (
    channel: 'email' | 'push',
    type: 'bookings' | 'payments' | 'maintenance' | 'marketing' | 'instant',
    value: boolean
  ) => {
    if (!preferences) return;

    setIsUpdating(true);
    try {
      await updatePreferences({
        ...preferences,
        [channel]: {
          ...preferences[channel],
          [type]: value
        }
      }).unwrap();
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div>Loading preferences...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Email Notifications</h3>
        <div className="mt-4 space-y-4">
          {Object.entries(preferences?.email ?? {}).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => handleToggle('email', key as 'bookings' | 'payments' | 'maintenance' | 'marketing' | 'instant', e.target.checked)}
                disabled={isUpdating}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2 capitalize">{key.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium">Push Notifications</h3>
        <div className="mt-4 space-y-4">
          {Object.entries(preferences?.push ?? {}).map(([key, value]) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleToggle('push', key as 'bookings' | 'payments' | 'maintenance' | 'marketing' | 'instant', e.target.checked)}
                disabled={isUpdating}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="ml-2 capitalize">{key.replace('_', ' ')}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
} 