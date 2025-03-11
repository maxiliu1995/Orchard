'use client';

import { useParams } from 'next/navigation';
import { useGetBookingQuery } from '@/store/api/bookings';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';

export default function PaymentConfirmationPage() {
  const { id } = useParams();
  const { data: booking, isLoading } = useGetBookingQuery(id as string);

  if (isLoading) return <LoadingSpinner />;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Payment Confirmation</h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Booking Reference</p>
              <p className="font-medium">{booking.id}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Pod</p>
              <p className="font-medium">{booking.pod.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="font-medium">
                {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount Paid</p>
              <p className="font-medium">${(booking.totalAmount / 100).toFixed(2)}</p>
            </div>

            <div className="mt-6">
              <p className="text-green-600 font-medium">
                Your payment has been confirmed and your pod is reserved.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 