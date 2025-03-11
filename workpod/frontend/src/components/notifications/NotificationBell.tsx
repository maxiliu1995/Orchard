'use client';

import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useGetNotificationsQuery } from '@/store/api/notifications';
import { NotificationList } from './NotificationList';
import { Notification } from '@/types/notification.types';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: notifications } = useGetNotificationsQuery();
  
  const unreadCount = notifications?.filter((n: Notification) => !n.isRead).length ?? 0;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <NotificationList onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}