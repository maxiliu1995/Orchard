import { z } from 'zod';

export const healthCheckSchema = z.object({
  includeDb: z.boolean().optional().default(true),
  detailed: z.boolean().optional().default(false)
});

export type HealthCheckParams = z.infer<typeof healthCheckSchema>; 