import { prisma } from '@/shared/database';
import { AppError, ErrorType } from '@/shared/errors';
import { logger } from '@/shared/logger/index';
import Stripe from 'stripe';
import { stripeService } from './stripeService';
import { paypalService } from './paypalService';
import { PayPalPayment } from '../types/payment.types';
import { BookingStatus, NotificationType } from '@prisma/client';
import { notificationService } from '@/core/notifications/services/notificationService';
import { NotificationData } from '@/core/notifications/types/notification.types';
import { PaymentMethod } from '../types/payment.types';

interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  bookingId: string;
  userId: string;
}

export class PaymentService {
  async createPaymentIntent({ amount, currency, bookingId, userId }: CreatePaymentIntentParams) {
    try {
      const paymentIntent = await stripeService.createPaymentIntent({
        amount,
        currency: 'usd',
        bookingId,
        paymentMethod: PaymentMethod.CARD
      }, {
        amount,
        currency: 'usd',
        metadata: { userId }
      });

      return paymentIntent;
    } catch (error) {
      throw new AppError('Failed to create payment intent', 500, ErrorType.PAYMENT);
    }
  }

  async handleWebhookEvent(event: any) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object);
        break;
      default:
        logger.info('Unhandled event type', { type: event.type });
    }
  }

  async handlePaymentSuccess(paymentIntent: any) {
    const { bookingId } = paymentIntent.metadata;
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' }
    });
    logger.info('Payment succeeded', { bookingId });
  }

  async handlePaymentFailure(paymentIntent: any) {
    const { bookingId } = paymentIntent.metadata;
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'FAILED' }
    });
    logger.error('Payment failed', { bookingId });
  }

  async createStripePaymentIntent(bookingId: string, amount: number) {
    try {
      const paymentIntent = await stripeService.createPaymentIntent({
        amount,
        currency: 'usd',
        bookingId,
        paymentMethod: PaymentMethod.CARD
      });

      await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentIntentId: paymentIntent.id }
      });

      return paymentIntent;
    } catch (error) {
      logger.error('Failed to create payment intent', { error, bookingId });
      throw error;
    }
  }

  async createPayPalPayment(bookingId: string, amount: number) {
    try {
      const payment = await paypalService.createPayment(amount) as PayPalPayment;
      
      await prisma.booking.update({
        where: { id: bookingId },
        data: { 
          paymentProvider: 'PAYPAL',
          externalPaymentId: payment.id 
        }
      });

      return payment;
    } catch (error) {
      logger.error('Failed to create PayPal payment', { error, bookingId });
      throw error;
    }
  }

  async confirmPayment(paymentIntentId: string) {
    const booking = await prisma.booking.findFirst({
      where: { paymentIntentId }
    });

    if (!booking) {
      throw new AppError('Payment not found', 404, ErrorType.PAYMENT);
    }

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED' }
    });

    return { status: 'CONFIRMED' };
  }

  async refundPayment(bookingId: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    });
  
    if (!booking) {
      throw new AppError('Booking not found', 404, ErrorType.PAYMENT);
    }
  
    try {
      const refund = await stripeService.createRefund(booking.paymentIntentId as string);
  
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' }
      });
  
      logger.info('Payment refunded', { 
        bookingId, 
        refundId: refund.id 
      });
  
      return refund;
    } catch (error) {
      logger.error('Refund failed', { bookingId, error });
      throw new AppError('Failed to process refund', 500, ErrorType.PAYMENT);
    }
  }

  async createPayment(params: { bookingId: string; amount: number; currency: string; }) {
    try {
      const paymentIntent = await stripeService.createPaymentIntent({
        amount: params.amount,
        currency: params.currency,
        bookingId: params.bookingId,
        paymentMethod: PaymentMethod.CARD
      });

      return {
        id: paymentIntent.id,
        status: 'COMPLETED',
        amount: params.amount
      };
    } catch (error) {
      throw new AppError('Failed to create payment', 500, ErrorType.PAYMENT);
    }
  }

  async processStripePayment({ bookingId, paymentMethodId, amount }: {
    bookingId: string;
    paymentMethodId: string;
    amount: number;
  }) {
    try {
      // Create payment intent with proper DTO
      const paymentIntent = await stripeService.createPaymentIntent({
        amount,
        currency: 'usd',
        bookingId,
        paymentMethod: PaymentMethod.CARD
      }, {
        amount,
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true
      });

      // Update booking status to CONFIRMED
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { 
          status: BookingStatus.CONFIRMED,
          paymentIntentId: paymentIntent.id
        }
      });

      // Send confirmation notification
      await notificationService.send({
        userId: booking.userId,
        type: NotificationType.BOOKING_CONFIRMED,
        podId: booking.workPodId,
        message: `Booking ${bookingId} has been confirmed`,
        startTime: new Date()
      });

      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          bookingId,
          amount,
          provider: 'STRIPE',
          status: 'COMPLETED',
          externalId: paymentIntent.id
        }
      });

      return payment;
    } catch (error) {
      // Update booking status to FAILED on payment error
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: BookingStatus.FAILED }
      });
      throw error;
    }
  }

  async handleStripeWebhook(event: any) {
    if (event.type === 'payment_intent.succeeded') {
      await this.handlePaymentSuccess(event.data.object);
      return { success: true };
    }
    return { success: false };
  }

  async capturePayPalPayment(paymentId: string) {
    const captureResult = await paypalService.capturePayment(paymentId);
    return {
      status: captureResult.status,
      id: captureResult.id
    };
  }
}

export const paymentService = new PaymentService();
export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!); 