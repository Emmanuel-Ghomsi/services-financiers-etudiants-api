import { z } from 'zod';

export const ResendFirstLoginEmailRequestSchema = z.object({
  email: z.string().email(),
});

export type ResendFirstLoginEmailRequest = z.infer<
  typeof ResendFirstLoginEmailRequestSchema
>;
