'use client';

import { Pod, PodStatus } from '@/types/api.types';
import { Button } from '@/components/ui/Button';
import { useCreateBookingMutation, useGetPodAvailabilityQuery } from '@/store/api/pods';
import { calculateDistance } from '@/utils/distance';
import { usePodAvailability } from '@/hooks/usePodAvailability';
import { useState } from 'react';
import { MaintenanceStatus } from './MaintenanceStatus';
import { Badge } from '@/components/ui/Badge';

interface PodCardProps {
  pod: Pod;
  userLocation: { latitude: number; longitude: number } | null;
  onClose?: () => void;
  onReserve?: () => void;
  onSelect?: (pod: Pod) => void;
}

export const PodCard = ({ pod, userLocation, onClose, onReserve, onSelect }: PodCardProps) => {
  const [createBooking] = useCreateBookingMutation();
  const [startTime, setStartTime] = useState(new Date().toISOString());
  const [endTime, setEndTime] = useState(new Date(Date.now() + 3600000).toISOString()); // 1 hour later

  const getStatusColor = (status: PodStatus): string => {
    switch (status) {
      case 'AVAILABLE': return 'text-green-600';
      case 'OCCUPIED': return 'text-red-600';
      case 'MAINTENANCE': return 'text-gray-600';
      case 'OFFLINE': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  const getStatusVariant = (status: PodStatus): "success" | "warning" | "danger" | "info" => {
    switch (status) {
      case 'AVAILABLE': return 'success';
      case 'OCCUPIED': return 'warning';
      case 'MAINTENANCE': return 'danger';
      case 'OFFLINE': return 'info';
      default: return 'info';
    }
  };

  const handleBooking = async () => {
    try {
      await createBooking({
        podId: pod.id,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString() // 1 hour booking
      });
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  // Add distance calculation if userLocation exists
  const distance = userLocation ? calculateDistance(
    userLocation,
    { latitude: pod.latitude, longitude: pod.longitude }
  ) : null;

  const { isAvailable, nextAvailable, isLoading: checkingAvailability } = usePodAvailability(
    pod.id,
    startTime,
    endTime
  );

  const isBookable = pod.status === 'AVAILABLE';

  const { data: availability } = useGetPodAvailabilityQuery({
    podId: pod.id,
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString() // 1 hour ahead
  });

  return (
    <div data-testid="pod-item" className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{pod.name}</h3>
        <Badge variant={getStatusVariant(pod.status)}>
          {pod.status}
        </Badge>
      </div>

      <div className="text-sm text-gray-500">
        <p>{pod.address}</p>
        <p className="mt-1">${pod.hourlyRate}/hour</p>
      </div>

      {distance && (
        <p className="text-sm text-gray-500">{distance.toFixed(1)} km away</p>
      )}

      <MaintenanceStatus status={pod.status} />

      {availability && !availability.available && (
        <p className="text-sm text-gray-500">
          Next available: {availability.nextAvailable}
        </p>
      )}

      <Button
        onClick={() => onSelect?.(pod)}
        disabled={!availability?.available}
        className="w-full"
      >
        {availability?.available ? 'Book Now' : 'Unavailable'}
      </Button>
    </div>
  );
} 