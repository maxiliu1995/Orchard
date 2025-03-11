import type { Stripe, StripePaymentRequestEvent } from '@stripe/stripe-js';

export interface PaymentMethodEvent extends StripePaymentRequestEvent {
    paymentMethod: Stripe.PaymentMethod;
    complete: (status: 'success' | 'fail' | 'invalid_shipping_address' | 'invalid_payer_name' | 'invalid_payer_phone' | 'invalid_payer_email') => void;
} 