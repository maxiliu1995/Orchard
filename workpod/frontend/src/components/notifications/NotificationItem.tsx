import { Notification } from '@/types/api.types';

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-medium">{notification.type}</h3>
      <p className="text-gray-600">{notification.data.message}</p>
      <span className="text-sm text-gray-400">{notification.createdAt}</span>
    </div>
  );
}

