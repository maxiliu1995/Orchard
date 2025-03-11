import { apiClient } from '@/lib/api/client';
import { debugLog } from '@/utils/debug';
import type { CreatePaymentRequest, PaymentResponse } from '../types';

export class PaymentError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'PaymentError';
  }
}

export const paymentService = {
  async createStripePayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await apiClient.post<PaymentResponse>(
        '/api/payments/stripe',
        data
      );
      debugLog('payment', 'Created Stripe payment', { bookingId: data.bookingId });
      return response.data;
    } catch (error) {
      debugLog('payment', 'Stripe payment error', error);
      throw new PaymentError(
        'Failed to create Stripe payment',
        'STRIPE_ERROR',
        error
      );
    }
  },

  async createPayPalPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await apiClient.post<PaymentResponse>(
        '/api/payments/paypal',
        data
      );
      debugLog('payment', 'Created PayPal payment', { bookingId: data.bookingId });
      return response.data;
    } catch (error) {
      debugLog('payment', 'PayPal payment error', error);
      throw new PaymentError(
        'Failed to create PayPal payment',
        'PAYPAL_ERROR',
        error
      );
    }
  }
}; 