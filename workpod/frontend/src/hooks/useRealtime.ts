import { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useDispatch } from 'react-redux';
import { setSession } from '@/store/slices/sessionSlice';
import { api } from '@/store/api';

export const useRealtime = () => {
  const { socket } = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    // Session events
    socket.on('session:expired', () => {
      dispatch(setSession({ token: null, expiresAt: null }));
    });

    // Pod events
    socket.on('pod:status-changed', (data: { podId: string }) => {
      dispatch(api.util.invalidateTags(['Pod']));
    });

    // Booking events
    socket.on('booking:updated', (data: { bookingId: string }) => {
      dispatch(api.util.invalidateTags(['Booking']));
    });

    // Access code events
    socket.on('access-code:generated', (data: { bookingId: string }) => {
      dispatch(api.util.invalidateTags(['AccessCode']));
    });

    return () => {
      socket.off('session:expired');
      socket.off('pod:status-changed');
      socket.off('booking:updated');
      socket.off('access-code:generated');
    };
  }, [socket, dispatch]);
}; 