import { z } from 'zod';

/**
 * Étape 1 : L'utilisateur demande à réinitialiser son mot de passe
 */
export const ForgotPasswordRequestSchema = z.object({
  email: z.string().email('Email invalide'),
});

export type ForgotPasswordRequest = z.infer<typeof ForgotPasswordRequestSchema>;
