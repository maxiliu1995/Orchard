'use client';

import { useParams } from 'next/navigation';
import { useGetBookingQuery } from '@/store/api/bookings';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { PaymentProvider } from '@/providers/PaymentProvider';

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const { data: booking, isLoading } = useGetBookingQuery(id as string);

  if (isLoading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <PaymentProvider>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Confirm Your Booking</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
          <div className="space-y-2">
            <p>Pod: {booking.pod.name}</p>
            <p>Start: {new Date(booking.startTime).toLocaleString()}</p>
            <p>End: {new Date(booking.endTime).toLocaleString()}</p>
            <p className="text-lg font-semibold">
              Total: ${(booking.totalAmount / 100).toFixed(2)}
            </p>
          </div>
        </div>

        <PaymentForm 
          bookingId={booking.id}
          amount={booking.totalAmount}
          onSuccess={() => {
            // Handle successful payment
          }}
        />
      </div>
    </PaymentProvider>
  );
} 