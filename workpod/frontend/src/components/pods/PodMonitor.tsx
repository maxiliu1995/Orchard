import { useGetPodStatusQuery, useGetPodHealthQuery } from '@/store/api/pods';
import { useSocket } from '@/contexts/SocketContext';
import { useEffect } from 'react';

interface PodMonitorProps {
  podId: string;
  onStatusChange?: (status: string) => void;
}

export const PodMonitor = ({ podId, onStatusChange }: PodMonitorProps) => {
  const { data: status, refetch: refetchStatus } = useGetPodStatusQuery(podId);
  const { data: health, refetch: refetchHealth } = useGetPodHealthQuery(podId);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-pod', podId);

    socket.on('pod:status-changed', (data: { podId: string }) => {
      if (data.podId === podId) {
        refetchStatus();
        refetchHealth();
      }
    });

    socket.on('pod:health-update', (data: { podId: string }) => {
      if (data.podId === podId) {
        refetchHealth();
      }
    });

    return () => {
      socket.emit('leave-pod', podId);
      socket.off('pod:status-changed');
      socket.off('pod:health-update');
    };
  }, [socket, podId]);

  if (!status || !health) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Pod Status</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Current Status</p>
          <p className="font-medium">{status.status}</p>
          <p className="text-xs text-gray-400">
            Last updated: {new Date(status.lastUpdated).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Health Status</p>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <div>
              <p className="text-xs text-gray-500">Connection</p>
              <p className={`font-medium ${health.online ? 'text-green-600' : 'text-red-600'}`}>
                {health.online ? 'Online' : 'Offline'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Battery</p>
              <p className="font-medium">{health.batteryLevel}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Temperature</p>
              <p className="font-medium">{health.temperature}°C</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 