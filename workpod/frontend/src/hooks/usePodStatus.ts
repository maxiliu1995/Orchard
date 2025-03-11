import { useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useGetPodQuery } from '@/store/api/pods';
import type { PodStatus } from '@/types/api.types';

export const usePodStatus = (podId: string) => {
  const { socket } = useSocket();
  const { data: pod, refetch } = useGetPodQuery(podId);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-pod', podId);

    socket.on('pod:status-changed', (data: { podId: string; status: PodStatus }) => {
      if (data.podId === podId) {
        refetch();
      }
    });

    socket.on('pod:maintenance-started', (data: { podId: string }) => {
      if (data.podId === podId) {
        refetch();
      }
    });

    socket.on('pod:maintenance-completed', (data: { podId: string }) => {
      if (data.podId === podId) {
        refetch();
      }
    });

    return () => {
      socket.emit('leave-pod', podId);
      socket.off('pod:status-changed');
      socket.off('pod:maintenance-started');
      socket.off('pod:maintenance-completed');
    };
  }, [socket, podId]);

  return pod;
}; 