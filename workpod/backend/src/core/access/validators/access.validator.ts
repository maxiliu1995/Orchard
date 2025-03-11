import { z } from 'zod';

export const accessLogSchema = z.object({
  userId: z.string().uuid(),
  podId: z.string().uuid(),
  accessType: z.enum(['ENTRY', 'EXIT']),
  timestamp: z.date()
});

export type CreateAccessLogParams = z.infer<typeof accessLogSchema>; 