'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { api, type ApiEndpoints } from '@/store/api';
import type { AppDispatch } from '@/store';
import type { Notification, Pod, Booking, PodStatus } from '@/types/api.types';
import { Draft } from 'immer';
import { EntityState } from '@reduxjs/toolkit';
import type { EndpointName } from '@/store/api';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

const debug = {
  log: (...args: any[]) => console.log(`[${new Date().toISOString()}] [Socket]`, ...args),
  error: (...args: any[]) => console.error(`[${new Date().toISOString()}] [Socket][ERROR]`, ...args),
  warn: (...args: any[]) => console.warn(`[${new Date().toISOString()}] [Socket][WARN]`, ...args)
};

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const socket = io('http://192.168.178.28:3001', {
      transports: ['polling', 'websocket'],
      withCredentials: true,
      auth: {
        token: token
      },
      extraHeaders: {
        Authorization: token ? `Bearer ${token}` : ''
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('Socket connected!', socket.id);
      setConnected(true);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection failed:', error.message);
    });

    socket.on('notification', (notification: Notification) => {
      dispatch(
        api.util.updateQueryData('getNotifications', undefined, (draft) => {
          draft.unshift({ ...notification });
        })
      );
    });

    socket.on('pod_status_change', (update: { podId: string; status: PodStatus }) => {
      dispatch(
        api.util.updateQueryData('getPods' as const, undefined, (draft: Draft<ApiEndpoints['getPods']>) => {
          const pod = draft.find(p => p.id === update.podId);
          if (pod) {
            Object.assign(pod, { status: update.status });
          }
        })
      );
    });

    socket.on('booking_update', (booking: Booking) => {
      dispatch(
        api.util.updateQueryData('getBookings', undefined, (draft) => {
          const index = draft.findIndex(b => b.id === booking.id);
          if (index !== -1) {
            draft[index] = { ...booking };
          } else {
            draft.unshift({ ...booking });
          }
        })
      );
    });

    socket.on('reconnect_attempt', (attempt) => {
      debug.warn('Attempting to reconnect:', { attempt });
    });

    socket.on('reconnect_error', (error) => {
      debug.error('Reconnection error:', { message: error.message });
    });

    socket.on('disconnect', (reason) => {
      debug.warn('Socket disconnected:', { reason });
      setConnected(false);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext); 