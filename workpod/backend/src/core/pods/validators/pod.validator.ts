import { z } from 'zod';
import { PodStatus } from '@prisma/client';

export const podSchema = z.object({
  name: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  address: z.string(),
  hourlyRate: z.number().positive(),
  status: z.nativeEnum(PodStatus),
  lockId: z.string()
});

export type CreatePodParams = z.infer<typeof podSchema>;
export type UpdatePodParams = Partial<CreatePodParams>;

export const createPodSchema = z.object({
  name: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    address: z.string()
  }),
  hourlyRate: z.number().positive()
});

export const updatePodStatusSchema = z.object({
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OFFLINE'])
}); 