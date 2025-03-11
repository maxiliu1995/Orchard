'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Button } from '../ui/Button';
import { showToast } from '@/utils/toast';
import { podService } from '@/services/pods/podService';
import { LogCategory } from '@/utils/debug';

interface PodAvailabilityProps {
  podId: string;
  startTime: Date;
  endTime: Date;
  onAvailable: () => void;
}

export function PodAvailability({ podId, startTime, endTime, onAvailable }: PodAvailabilityProps) {
  const [isChecking, setIsChecking] = useState(false);

  const { data: availability, isLoading, error } = useQuery({
    queryKey: ['podAvailability', podId, startTime, endTime],
    queryFn: () => podService.checkAvailability(podId, startTime, endTime),
    enabled: !isChecking
  });

  const handleCheck = async () => {
    setIsChecking(true);
    try {
      const isAvailable = await podService.checkAvailability(podId, startTime, endTime);
      if (isAvailable) {
        onAvailable();
      } else {
        showToast('error', 'Pod is not available for selected time slot');
      }
    } catch (error) {
      showToast('error', 'Failed to check pod availability');
    } finally {
      setIsChecking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 h-8 w-8" data-testid="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-4">Failed to check availability</p>
        <Button onClick={handleCheck} variant="secondary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium mb-2">Selected Time Slot</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Start:</span>
            <p>{format(startTime, 'PPp')}</p>
          </div>
          <div>
            <span className="text-gray-600">End:</span>
            <p>{format(endTime, 'PPp')}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${availability?.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm">
            {availability?.isAvailable ? 'Available' : 'Not Available'}
          </span>
        </div>
        <Button
          onClick={handleCheck}
          disabled={isChecking}
          loading={isChecking}
          variant={availability?.isAvailable ? 'primary' : 'secondary'}
        >
          {availability?.isAvailable ? 'Continue Booking' : 'Check Again'}
        </Button>
      </div>
    </div>
  );
} 