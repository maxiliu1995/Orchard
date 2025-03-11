import { loadStripe } from '@stripe/stripe-js';
import api from './api';
import { PaymentProvider } from '@/types/api.types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface PaymentIntent {
  id: string;
  amount: number;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded';
  clientSecret: string;
}

export const PaymentService = {
  async createPaymentIntent(bookingId: string, amount: number): Promise<PaymentIntent> {
    const response = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, amount }),
    });
    return response.json();
  },

  async confirmPayment(paymentIntentId: string, provider: PaymentProvider) {
    const response = await fetch('/api/payments/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentIntentId, provider }),
    });
    return response.json();
  },

  async getPaymentMethods(): Promise<Array<{ id: string; type: string; last4: string }>> {
    const response = await fetch('/api/payments/methods');
    return response.json();
  },

  async addPaymentMethod(paymentMethodId: string) {
    const response = await fetch('/api/payments/methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentMethodId }),
    });
    return response.json();
  },

  async getStripe() {
    return await stripePromise;
  }
}; 