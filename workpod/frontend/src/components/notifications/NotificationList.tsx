import { useGetNotificationsQuery } from '@/store/api/notifications';
import { NotificationItem } from './NotificationItem';
import { Notification } from '@/types/api.types';

interface NotificationListProps {
  onClose: () => void;
}

export function NotificationList({ onClose }: NotificationListProps) {
  const { data: notifications, isLoading } = useGetNotificationsQuery();

  if (isLoading) return <div>Loading notifications...</div>;

  return (
    <div className="space-y-3">
      {notifications?.map((notification: Notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
        />
      ))}
    </div>
  );
} 