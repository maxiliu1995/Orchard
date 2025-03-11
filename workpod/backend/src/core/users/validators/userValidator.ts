import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  password: z.string().min(8)
});

export type CreateUserParams = z.infer<typeof userSchema>;
export type UpdateUserParams = Partial<CreateUserParams>;

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  phoneNumber: z.string().optional(),
  avatar: z.string().url().optional()
});

export const userPreferencesSchema = z.object({
  notifications: z.boolean(),
  newsletter: z.boolean(),
  language: z.string()
});

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  preferences: z.record(z.any()).optional()
}); 