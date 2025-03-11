import type { PayPalScriptOptions } from '@paypal/paypal-js';
import type { Stripe, StripeElements } from '@stripe/stripe-js';

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'succeeded';
  amount: number;
  currency: string;
}

export interface PaymentError {
  code: string;
  message: string;
  decline_code?: string;
}

export interface CreatePaymentIntentRequest {
  bookingId: string;
  amount: number;
  currency: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

export interface PayPalOrderResponse {
  orderId: string;
  approvalUrl: string;
}

export interface PaymentConfig {
  stripe: {
    publishableKey: string;
  };
  paypal: PayPalScriptOptions;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  brand?: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  bookingId: string;
  createdAt: string;
  metadata: {
    podName: string;
    duration: number;
  };
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'unpaid' | 'void';
  issuedAt: string;
  paidAt?: string;
  transactions: Transaction[];
  pdf_url: string;
}

export interface StripePaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'requires_action' | 'succeeded' | 'canceled' | 'failed';
}

export interface StripeSetupIntent {
  id: string;
  clientSecret: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'succeeded' | 'canceled' | 'failed';
} 