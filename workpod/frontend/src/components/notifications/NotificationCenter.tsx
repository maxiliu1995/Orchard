import { useGetNotificationsQuery, useMarkAsReadMutation } from '@/store/api/notifications';
import { NotificationType } from '@/types/api.types';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'BOOKING_CONFIRMED': return '✅';
    case 'BOOKING_CANCELLED': return '❌';
    case 'PAYMENT_FAILED': return '💳';
    case 'POD_MAINTENANCE': return '🔧';
    case 'PAYMENT_SUCCESS': return '💰';
    case 'ACCESS_CODE_GENERATED': return '🔑';
    default: return '📬';
  }
};

export const NotificationCenter = () => {
  const { data: notifications, isLoading } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  if (isLoading) return <div>Loading notifications...</div>;

  return (
    <div className="space-y-4">
      {notifications?.map((notification) => (
        <div 
          key={notification.id}
          className="bg-white p-4 rounded-lg shadow flex items-start gap-3"
        >
          <div className="text-xl">{getNotificationIcon(notification.type)}</div>
          <div className="flex-1">
            <div className="font-medium">
              {notification.data.title || notification.type}
            </div>
            <div className="text-sm text-gray-600">
              {notification.data.message}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(notification.createdAt).toLocaleString()}
            </div>
          </div>
          {notification.status === 'PENDING' && (
            <button
              onClick={() => markAsRead(notification.id)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark as read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}; 