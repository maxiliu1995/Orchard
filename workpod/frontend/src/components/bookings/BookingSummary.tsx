import { Booking } from '@/types/api.types';
import { useCancelBookingMutation } from '@/store/api/bookings';

interface BookingSummaryProps {
  booking: Booking;
  showActions?: boolean;
}

export const BookingSummary = ({ booking, showActions = true }: BookingSummaryProps) => {
  const [cancelBooking, { isLoading }] = useCancelBookingMutation();

  const handleCancel = async () => {
    try {
      await cancelBooking(booking.id);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{booking.pod.name}</h3>
          <p className="text-gray-600">
            {new Date(booking.startTime).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500">
            Status: <span className="font-medium">{booking.status}</span>
          </p>
        </div>
        {showActions && booking.status === 'PENDING' && (
          <button
            onClick={handleCancel}
            disabled={isLoading}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}; 