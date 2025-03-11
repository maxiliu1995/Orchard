import { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useGetBookingQuery } from '@/store/api/bookings';
import type { BookingStatus } from '@/types/api.types';

export const useBookingStatus = (bookingId: string) => {
  const { socket } = useSocket();
  const { data: booking, refetch } = useGetBookingQuery(bookingId);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-booking', bookingId);
    
    socket.on('booking:status-updated', (data) => {
      if (data.bookingId === bookingId) {
        refetch();
      }
    });

    return () => {
      socket.emit('leave-booking', bookingId);
      socket.off('booking:status-updated');
    };
  }, [socket, bookingId]);

  return booking;
}; 