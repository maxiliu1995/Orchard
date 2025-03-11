import { z } from 'zod';
import { NotificationType } from '@prisma/client';

export const notificationSchema = z.object({
  userId: z.string().uuid(),
  type: z.nativeEnum(NotificationType),
  data: z.record(z.any())
});

export type CreateNotificationParams = z.infer<typeof notificationSchema>; 