'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import type { StripeError } from '@stripe/stripe-js';
import { Button } from '../ui/Button';
import { showToast } from '@/utils/toast';
import { debugLog } from '@/utils/debug';

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: Error) => void;
}

export function StripePayment({ amount, onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bookings/confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        debugLog('payment', 'Stripe payment error', error);
        showToast('error', error.message || 'Payment failed');
        onError(new Error(error.message || 'Payment failed'));
      } else if (paymentIntent?.status === 'succeeded') {
        debugLog('payment', 'Stripe payment succeeded', { id: paymentIntent.id });
        showToast('success', 'Payment successful');
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment failed');
      debugLog('payment', 'Stripe payment error', error);
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        loading={isProcessing}
        className="w-full"
      >
        Pay ${amount.toFixed(2)}
      </Button>
    </form>
  );
} 