import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/services/booking/bookingService';
import { DateTimePicker } from '@/components/common/DateTimePicker';
import { Button } from '@/components/ui/Button';
import { showToast } from '@/utils/toast';
import { useSocket } from '@/contexts/SocketContext';
import { useCreateBookingMutation } from '@/store/api/bookings';
import { Pod } from '@/types/api.types';

interface BookingFormProps {
  pod: Pod;
  onSuccess: (bookingId: string) => void;
  onError: (error: string) => void;
}

export const BookingForm = ({ pod, onSuccess, onError }: BookingFormProps) => {
  const router = useRouter();
  const socket = useSocket();
  const [createBooking, { isLoading }] = useCreateBookingMutation();
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) return;

    try {
      const booking = await createBooking({
        podId: pod.id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }).unwrap();

      onSuccess(booking.id);
    } catch (err) {
      onError('Failed to create booking. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Book {pod.name}</h3>
        <p className="text-sm text-gray-500">
          ${pod.hourlyRate}/hour
        </p>
      </div>

      <div className="space-y-2">
        <DateTimePicker
          label="Start Time"
          value={startTime}
          onChange={setStartTime}
          minDate={new Date()}
        />
        <DateTimePicker
          label="End Time"
          value={endTime}
          onChange={setEndTime}
          minDate={startTime || new Date()}
        />
      </div>

      <Button
        type="submit"
        disabled={!startTime || !endTime || isLoading}
        loading={isLoading}
        className="w-full"
      >
        Book Now
      </Button>
    </form>
  );
};

function calculateTotal(start: Date, end: Date, rate: number): number {
  const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  return hours * rate;
} 