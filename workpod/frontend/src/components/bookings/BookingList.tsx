import { useGetBookingsQuery } from '@/store/api/bookings';
import { formatDate } from '@/utils/date';
import { Badge } from '@/components/ui/Badge';

const getStatusVariant = (status: string): "success" | "warning" | "danger" | "info" => {
  switch (status) {
    case 'CONFIRMED': return 'success';
    case 'PENDING': return 'warning';
    case 'CANCELLED': return 'danger';
    default: return 'info';
  }
};

export const BookingList = () => {
  const { data: bookings = [], isLoading } = useGetBookingsQuery();

  if (isLoading) return <div>Loading bookings...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found</p>
      ) : (
        <div className="space-y-2">
          {bookings.map(booking => (
            <div key={booking.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{booking.pod.name}</h3>
                <Badge variant={getStatusVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>From: {formatDate(booking.startTime)}</p>
                <p>To: {formatDate(booking.endTime)}</p>
                <p>Total: ${booking.totalAmount}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 