import Stripe from 'stripe';
import { logger } from '@/shared/logger/index';
import type { CreatePaymentIntentDto } from '../types/payment.types';
import { AppError, ErrorType } from '../../../shared/errors/errorTypes';

export class StripeService {
  private stripe: Stripe;

  constructor(stripeInstance?: Stripe) {
    // Allow injection of stripe instance for testing
    if (stripeInstance) {
      this.stripe = stripeInstance;
    } else {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2025-02-24.acacia'
      });
    }
  }

  async createPaymentIntent(data: CreatePaymentIntentDto, options?: Stripe.PaymentIntentCreateParams) {
    return this.stripe.paymentIntents.create({
      amount: data.amount,
      currency: data.currency,
      metadata: { bookingId: data.bookingId },
      ...options
    });
  }

  async handleWebhook(event: Stripe.Event) {
    // Webhook handling logic
    return { received: true };
  }

  async handleApplePay(paymentIntentId: string, token: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: token
      });
      return paymentIntent;
    } catch (error) {
      logger.error('Failed to process Apple Pay payment', { error });
      throw new AppError('Failed to process Apple Pay payment', 400);
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string) {
    try {
      const result = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });
      return result;
    } catch (error) {
      logger.error('Failed to confirm payment', { error });
      throw new AppError('Confirmation failed', 400);
    }
  }

  async capturePayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.capture(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      logger.error('Failed to capture payment', { error });
      throw new AppError('Failed to capture payment', 400);
    }
  }

  async createRefund(paymentIntentId: string): Promise<any> {
    try {
      return await this.stripe.refunds.create({
        payment_intent: paymentIntentId
      });
    } catch (error) {
      logger.error('Failed to create refund', { error });
      throw new AppError('Failed to create refund', 500, ErrorType.PAYMENT);
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.stripe.paymentIntents.list({ limit: 1 });
      return true;
    } catch (error) {
      throw error;
    }
  }
}

// For production
export const stripeService = new StripeService();
