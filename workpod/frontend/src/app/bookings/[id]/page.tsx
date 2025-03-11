'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGetBookingQuery } from '@/store/api/bookings';
import { useSocket } from '@/contexts/SocketContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { useEffect } from 'react';
import { AccessCode } from '@/components/bookings/AccessCode';

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const { socket } = useSocket();
  const { data: booking, isLoading } = useGetBookingQuery(id as string);

  useEffect(() => {
    if (socket && booking) {
      socket.emit('join-booking', booking.id);

      return () => {
        socket.emit('leave-booking', booking.id);
      };
    }
  }, [socket, booking]);

  if (isLoading) return <LoadingSpinner />;
  if (!booking) return <div>Booking not found</div>;

  const handlePayment = () => {
    router.push(`/bookings/${booking.id}/payment`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Booking Confirmation</h1>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Pod Details</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Pod:</span> {booking.pod.name}
              </p>
              <p>
                <span className="text-gray-500">Location:</span> {booking.pod.location.address}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Booking Details</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Start Time:</span>{' '}
                {new Date(booking.startTime).toLocaleString()}
              </p>
              <p>
                <span className="text-gray-500">End Time:</span>{' '}
                {new Date(booking.endTime).toLocaleString()}
              </p>
              <p>
                <span className="text-gray-500">Duration:</span>{' '}
                {Math.round((new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / 3600000)} hours
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Payment Details</h2>
            <div className="space-y-2">
              <p>
                <span className="text-gray-500">Amount:</span> ${(booking.totalAmount / 100).toFixed(2)}
              </p>
              <p>
                <span className="text-gray-500">Status:</span>{' '}
                <span className={`font-medium ${booking.status === 'CONFIRMED' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {booking.status}
                </span>
              </p>
            </div>
          </div>

          {booking.status === 'PENDING' && (
            <Button
              onClick={handlePayment}
              className="w-full"
            >
              Proceed to Payment
            </Button>
          )}

          {booking.status === 'CONFIRMED' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700">
                Your booking is confirmed! You will receive access details closer to your booking time.
              </p>
            </div>
          )}

          {booking.status === 'CONFIRMED' && (
            <div className="mt-6">
              <AccessCode 
                bookingId={booking.id}
                onCheckInSuccess={() => {
                  router.refresh();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 