import { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useGetBookingQuery } from '@/store/api/bookings';
import { BookingStatus } from '@/types/api.types';

export const useBookingMonitor = (bookingId: string) => {
  const { socket } = useSocket();
  const { data: booking, refetch } = useGetBookingQuery(bookingId);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-booking', bookingId);

    const handleStatusChange = (data: { bookingId: string; status: BookingStatus }) => {
      if (data.bookingId === bookingId) {
        refetch();
      }
    };

    socket.on('booking:status-changed', handleStatusChange);
    socket.on('booking:extended', () => refetch());
    socket.on('booking:payment-updated', () => refetch());

    return () => {
      socket.emit('leave-booking', bookingId);
      socket.off('booking:status-changed');
      socket.off('booking:extended');
      socket.off('booking:payment-updated');
    };
  }, [socket, bookingId]);

  return booking;
}; 