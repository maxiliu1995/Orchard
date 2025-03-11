import { useState } from 'react';
import { useGetBookingQuery, useExtendBookingMutation } from '@/store/api/bookings';
import { Button } from '@/components/ui/Button';
import { AccessCode } from './AccessCode';

interface BookingDetailsProps {
  bookingId: string;
}

export const BookingDetails = ({ bookingId }: BookingDetailsProps) => {
  const { data: booking } = useGetBookingQuery(bookingId);
  const [extendBooking] = useExtendBookingMutation();
  const [extending, setExtending] = useState(false);

  if (!booking) return null;

  const handleExtend = async () => {
    try {
      const newEndTime = new Date(Date.now() + 3600000).toISOString(); // +1 hour
      await extendBooking({ 
        bookingId: booking.id, 
        endTime: newEndTime 
      }).unwrap();
    } catch (error) {
      console.error('Failed to extend booking:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">{booking.status}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Pod</p>
            <p className="font-medium">{booking.pod.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">
              {new Date(booking.startTime).toLocaleString()} - 
              {new Date(booking.endTime!).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-medium">${booking.totalAmount}</p>
          </div>

          {booking.status === 'CONFIRMED' && (
            <div className="flex gap-4">
              <Button onClick={handleExtend} loading={extending}>
                Extend Booking
              </Button>
            </div>
          )}
        </div>
      </div>

      {booking.status === 'CONFIRMED' && (
        <AccessCode bookingId={booking.id} />
      )}
    </div>
  );
}; 