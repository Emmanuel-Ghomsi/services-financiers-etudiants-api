import { z } from 'zod';

/**
 * Schéma pour définir son mot de passe lors de la première connexion
 */
export const SetPasswordRequestSchema = z.object({
  token: z.string().nonempty('Le token est requis'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

export type SetPasswordRequest = z.infer<typeof SetPasswordRequestSchema>;
