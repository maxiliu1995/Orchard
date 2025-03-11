'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { useSocket } from '@/contexts/SocketContext';
import { bookingService } from '@/services/booking/bookingService';
import { Booking } from '@/types/booking';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export default function PaymentPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const clientSecret = searchParams.get('clientSecret');
  const [booking, setBooking] = useState<Booking | null>(null);
  const socket = useSocket();

  useEffect(() => {
    const loadBooking = async () => {
      const data = await bookingService.getBookingStatus(params.id);
      setBooking(data);
    };
    loadBooking();

    // Listen for booking updates
    socket.on('booking-update', ({ status }) => {
      setBooking(prev => prev ? { ...prev, status } : null);
    });

    return () => {
      socket.off('booking-update');
    };
  }, [params.id, socket]);

  if (!clientSecret || !booking) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Complete Your Booking</h1>
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: { theme: 'stripe' }
        }}
      >
        <PaymentForm 
          bookingId={params.id}
          amount={booking.totalAmount}
        />
      </Elements>
    </div>
  );
} 