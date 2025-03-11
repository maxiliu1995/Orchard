import { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useGetPodAvailabilityQuery } from '@/store/api/pods';

export const usePodAvailability = (podId: string, startTime?: string, endTime?: string) => {
  const { socket } = useSocket();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const { data, isLoading } = useGetPodAvailabilityQuery(
    { podId, startTime: startTime || '', endTime: endTime || '' },
    { skip: !startTime || !endTime }
  );

  useEffect(() => {
    if (data) {
      setIsAvailable(data.available);
    }
  }, [data]);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-pod', podId);

    socket.on('pod:status-changed', (data: { podId: string; available: boolean }) => {
      if (data.podId === podId) {
        setIsAvailable(data.available);
      }
    });

    return () => {
      socket.emit('leave-pod', podId);
      socket.off('pod:status-changed');
    };
  }, [socket, podId]);

  return {
    isAvailable,
    nextAvailable: data?.nextAvailable,
    isLoading
  };
}; 