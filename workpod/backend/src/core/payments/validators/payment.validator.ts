import { z } from 'zod';
import { PaymentMethod, PaymentProvider } from '../types/payment.types';

export const paymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  bookingId: z.string().uuid(),
  paymentMethod: z.enum(['STRIPE', 'PAYPAL'] as const)
});

export const paymentMethodSchema = z.object({
  type: z.enum(['STRIPE', 'PAYPAL'] as const),
  provider: z.enum(['STRIPE', 'PAYPAL'] as const),
  details: z.record(z.any())
});

export type CreatePaymentIntentParams = z.infer<typeof paymentIntentSchema>;
export type UpdatePaymentMethodParams = z.infer<typeof paymentMethodSchema>;

export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string(),
  paymentMethodId: z.string()
});

export const createPaymentSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  bookingId: z.string()
}); 