import { z } from 'zod';

/**
 * Requête pour modifier le mot de passe sans ancien mot de passe
 */
export const ChangePasswordRequestSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;
