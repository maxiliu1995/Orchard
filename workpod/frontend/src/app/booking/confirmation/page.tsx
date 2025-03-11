'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { StripeProvider } from '@/providers/StripeProvider';

export default function BookingConfirmationPage() {
  const [clientSecret, setClientSecret] = useState<string>();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    if (bookingId) {
      // Fetch booking details and client secret
      fetch(`/api/bookings/${bookingId}`)
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret));
    }
  }, [bookingId]);

  if (!clientSecret) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Complete Your Booking</h1>
      <StripeProvider clientSecret={clientSecret}>
        <PaymentForm 
          clientSecret={clientSecret}
          onSuccess={() => {
            // Handle successful payment
            console.log('Payment successful');
          }}
        />
      </StripeProvider>
    </div>
  );
} 