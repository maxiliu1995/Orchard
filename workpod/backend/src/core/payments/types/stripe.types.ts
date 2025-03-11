import type { Stripe } from 'stripe';

export interface StripePaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'processing' | 'requires_action' | 'succeeded' | 'canceled' | 'failed';
}

export interface StripePaymentIntentCreateParams {
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
  confirm?: boolean;
  payment_method?: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Stripe.PaymentIntent | Stripe.Refund;
  };
} 