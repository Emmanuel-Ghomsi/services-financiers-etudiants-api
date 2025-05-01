import { z } from 'zod';

/**
 * Étape 2 : Réinitialisation du mot de passe avec un token reçu par email
 */
export const ResetPasswordRequestSchema = z.object({
  token: z.string().nonempty('Le token est requis'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type ResetPasswordRequest = z.infer<typeof ResetPasswordRequestSchema>;
