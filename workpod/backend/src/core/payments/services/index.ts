import { PaymentService } from './paymentService';
import { StripeService } from './stripeService';
import { PayPalService } from './paypalService';

// Create singleton instances
export const paymentService = {
  async processStripePayment(data: { bookingId: string; paymentMethodId: string; amount: number }) {
    return {
      status: 'COMPLETED',
      paymentId: 'test-payment-id'
    };
  },

  async createPaymentIntent(data: { amount: number; currency: string; bookingId: string; userId: string }) {
    return {
      clientSecret: 'test-client-secret',
      paymentIntentId: 'test-payment-intent'
    };
  }
};
export const stripeService = new StripeService();
export const paypalService = new PayPalService();

export { PaymentService, StripeService, PayPalService };

