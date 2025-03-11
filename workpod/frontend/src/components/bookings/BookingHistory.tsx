import { useState } from 'react';
import { useGetBookingHistoryQuery } from '@/store/api/bookings';
import { BookingStatus } from '@/types/api.types';
import { Button } from '@/components/ui/Button';

const statusFilters: BookingStatus[] = ['COMPLETED', 'CANCELLED', 'FAILED'];

export const BookingHistory = () => {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | undefined>();
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  
  const { data: bookings, isLoading } = useGetBookingHistoryQuery({
    status: selectedStatus,
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  if (isLoading) return <div>Loading history...</div>;

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div className="space-x-2">
          {statusFilters.map(status => (
            <Button
              key={status}
              variant={selectedStatus === status ? 'primary' : 'secondary'}
              onClick={() => setSelectedStatus(status === selectedStatus ? undefined : status)}
            >
              {status}
            </Button>
          ))}
        </div>

        <input
          type="date"
          value={dateRange.start}
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          className="border rounded px-2 py-1"
        />
        <span>to</span>
        <input
          type="date"
          value={dateRange.end}
          onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
          className="border rounded px-2 py-1"
        />
      </div>

      <div className="space-y-4">
        {bookings?.map(booking => (
          <div key={booking.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{booking.pod.name}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(booking.startTime).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <div className="font-medium">${booking.totalAmount}</div>
                <div className="text-sm text-gray-600">{booking.status}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 