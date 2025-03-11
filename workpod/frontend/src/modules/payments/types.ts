import type { PayPalScriptOptions } from '@paypal/paypal-js';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded';
  amount: number;
  currency: string;
}

export interface CreatePaymentRequest {
  bookingId: string;
  amount: number;
  currency: string;
}

export interface PaymentResponse {
  id: string;
  status: string;
}

export interface PaymentConfig {
  stripe: {
    publishableKey: string;
  };
  paypal: PayPalScriptOptions;
} 