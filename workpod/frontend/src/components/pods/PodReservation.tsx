import { useState } from 'react';
import { useReservePodMutation, useGetPodAvailabilityQuery } from '@/store/api/pods';
import { Pod } from '@/types/api.types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

interface PodReservationProps {
  pod: Pod;
  onSuccess: (bookingId: string) => void;
}

export const PodReservation = ({ pod, onSuccess }: PodReservationProps) => {
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1); // hours
  const [reservePod, { isLoading: isReserving }] = useReservePodMutation();

  const endTime = startTime ? 
    new Date(new Date(startTime).getTime() + duration * 3600000).toISOString() : 
    '';

  const { data: availability, isLoading: checkingAvailability } = useGetPodAvailabilityQuery(
    { podId: pod.id, startTime, endTime },
    { skip: !startTime || !endTime }
  );

  const handleReserve = async () => {
    try {
      const result = await reservePod({
        podId: pod.id,
        startTime,
        endTime,
      }).unwrap();
      
      onSuccess(result.bookingId);
    } catch (error) {
      console.error('Reservation failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          min={new Date().toISOString().slice(0, 16)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {[1, 2, 3, 4].map(hours => (
            <option key={hours} value={hours}>{hours} hour{hours > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      {checkingAvailability ? (
        <LoadingSpinner size="sm" />
      ) : availability?.available ? (
        <Button
          onClick={handleReserve}
          disabled={isReserving}
          loading={isReserving}
          className="w-full"
        >
          Reserve Pod
        </Button>
      ) : (
        <div className="text-red-600 text-sm">
          Pod not available at selected time.
          {availability?.nextAvailable && (
            <div>Next available: {new Date(availability.nextAvailable).toLocaleString()}</div>
          )}
        </div>
      )}
    </div>
  );
}; 