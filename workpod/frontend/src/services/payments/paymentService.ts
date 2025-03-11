import { apiClient } from '@/lib/api/client';
import { debugLog } from '@/utils/debug';
import type { 
  CreatePaymentIntentRequest, 
  PaymentIntentResponse, 
  PayPalOrderResponse 
} from '@/types/payment.types';

class PaymentError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'PaymentError';
  }
}

export const paymentService = {
  async createStripePaymentIntent(data: CreatePaymentIntentRequest): Promise<PaymentIntentResponse> {
    try {
      const response = await apiClient.post<PaymentIntentResponse>(
        '/payments/stripe/create-intent',
        data
      );
      debugLog('payment', 'Created Stripe payment intent', { bookingId: data.bookingId });
      return response.data;
    } catch (error) {
      debugLog('payment', 'Error creating Stripe payment intent', error);
      throw new PaymentError(
        'Failed to create payment intent',
        error instanceof Error ? error.message : undefined
      );
    }
  },

  async createPayPalOrder(data: CreatePaymentIntentRequest): Promise<PayPalOrderResponse> {
    try {
      const response = await apiClient.post<PayPalOrderResponse>(
        '/payments/paypal/create-order',
        data
      );
      debugLog('payment', 'Created PayPal order', { bookingId: data.bookingId });
      return response.data;
    } catch (error) {
      debugLog('payment', 'Error creating PayPal order', error);
      throw new PaymentError(
        'Failed to create PayPal order',
        error instanceof Error ? error.message : undefined
      );
    }
  }
}; 