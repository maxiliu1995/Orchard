import { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useGetAccessCodeQuery } from '@/store/api/access';

export const useAccessCode = (bookingId: string) => {
  const { socket } = useSocket();
  const { data: accessCode, refetch } = useGetAccessCodeQuery(bookingId);

  useEffect(() => {
    if (!socket) return;

    socket.on('access-code:updated', (data: { bookingId: string }) => {
      if (data.bookingId === bookingId) {
        refetch();
      }
    });

    return () => {
      socket.off('access-code:updated');
    };
  }, [socket, bookingId, refetch]);

  return accessCode;
}; 