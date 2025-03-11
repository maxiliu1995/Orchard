import { z } from 'zod';

export const unlockPodSchema = z.object({
  podId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const generateAccessCodeSchema = z.object({
  bookingId: z.string().uuid(),
  validityDuration: z.number().min(1).max(24), // hours
});

export const revokeAccessCodeSchema = z.object({
  bookingId: z.string().uuid(),
  code: z.string()
});

export const lockSchema = z.object({
  id: z.string(),
  lockId: z.string()
});

export const accessCodeSchema = z.object({
  code: z.string(),
  validFrom: z.date(),
  validUntil: z.date(),
  status: z.enum(['ACTIVE', 'REVOKED'])
});

export type CreateLockParams = z.infer<typeof lockSchema>;
export type GenerateAccessCodeParams = z.infer<typeof accessCodeSchema>;
