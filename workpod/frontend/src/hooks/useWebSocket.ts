import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { api } from '@/store/api';

let socket: Socket | null = null;

export const useWebSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_WS_URL!);

      socket.on('booking:updated', () => {
        dispatch(api.util.invalidateTags(['Booking']));
      });

      socket.on('notification:new', () => {
        dispatch(api.util.invalidateTags(['Notification']));
      });
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [dispatch]);

  return socket;
}; 