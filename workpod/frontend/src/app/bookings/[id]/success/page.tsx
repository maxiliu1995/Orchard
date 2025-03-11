'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useBookingStatus } from '@/hooks/useBookingStatus';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';

export default function BookingSuccessPage() {
  const { id } = useParams();
  const router = useRouter();
  const { booking, status, isLoading } = useBookingStatus(id as string);

  useEffect(() => {
    if (status === 'CONFIRMED') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [status]);

  if (isLoading) return <LoadingSpinner />;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Your pod is reserved and ready for your arrival. We've sent the details to your email.
        </p>

        <div className="space-y-4">
          <Button
            onClick={() => router.push(`/bookings/${booking.id}`)}
            className="w-full"
          >
            View Booking Details
          </Button>

          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard')}
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
} 