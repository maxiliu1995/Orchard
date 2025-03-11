import { z } from 'zod';

export const createBookingSchema = z.object({
  podId: z.string().uuid(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  addOns: z.array(z.string().uuid()).optional()
});

export const updateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  endTime: z.string().datetime().optional()
});

export const extendBookingSchema = z.object({
  duration: z.number().min(1).max(24) // hours
});

export const bookingSchema = z.object({
  podId: z.string(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime()
});

export type CreateBookingParams = z.infer<typeof bookingSchema>;
export type UpdateBookingParams = Partial<CreateBookingParams>;
