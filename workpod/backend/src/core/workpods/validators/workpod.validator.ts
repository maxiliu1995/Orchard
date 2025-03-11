import { z } from 'zod';

export const workPodSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  hourlyRate: z.number().positive(),
  latitude: z.number(),
  longitude: z.number(),
  lockId: z.string()
});

export type CreateWorkPodParams = z.infer<typeof workPodSchema>; 