import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  preferences: z.object({
    notifications: z.boolean(),
    newsletter: z.boolean(),
    language: z.string()
  })
});

export type UpdateProfileParams = Partial<z.infer<typeof profileSchema>>; 