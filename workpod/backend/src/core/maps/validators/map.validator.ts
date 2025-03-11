import { z } from 'zod';

export const geocodeSchema = z.object({
  address: z.string(),
  // Add other map-related validation fields
});

export const distanceSchema = z.object({
  origin: z.string(),
  destination: z.string()
}); 