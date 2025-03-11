export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export enum PaymentMethod {
  CARD = 'card',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay'
}

export type PaymentProvider = 'STRIPE' | 'PAYPAL';

export interface PaymentConfig {
  stripePublicKey: string;
  paypalClientId: string;
  supportedMethods: PaymentProvider[];
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface CreatePaymentIntentDto {
  amount: number;
  currency: string;
  bookingId: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
}

export interface PaymentWebhookData {
  eventType: string;
  paymentId: string;
  status: PaymentStatus;
  metadata?: Record<string, any>;
}

export interface PayPalPayment {
  id: string;
  status: string;
  amount: number;
} 