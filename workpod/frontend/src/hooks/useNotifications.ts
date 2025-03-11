import { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useGetNotificationsQuery } from '@/store/api/notifications';

export const useNotifications = () => {
  const { socket } = useSocket();
  const { data: notifications, refetch } = useGetNotificationsQuery();

  useEffect(() => {
    if (!socket) return;

    socket.on('notification:created', () => {
      refetch();
    });

    socket.on('notification:updated', () => {
      refetch();
    });

    return () => {
      socket.off('notification:created');
      socket.off('notification:updated');
    };
  }, [socket]);

  return notifications;
}; 