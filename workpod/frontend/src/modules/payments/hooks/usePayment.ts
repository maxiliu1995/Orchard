import { useState } from 'react';
import { paymentService } from '../services/paymentService';
import type { CreatePaymentRequest, PaymentResponse } from '../types';
import { showToast } from '@/utils/toast';

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPayment = async (
    provider: 'stripe' | 'paypal',
    data: CreatePaymentRequest
  ): Promise<PaymentResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await (provider === 'stripe'
        ? paymentService.createStripePayment(data)
        : paymentService.createPayPalPayment(data));
      return response;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment failed');
      setError(error);
      showToast('error', error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createPayment,
    isLoading,
    error
  };
} 