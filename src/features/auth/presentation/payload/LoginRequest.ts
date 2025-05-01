import { z } from 'zod';

/**
 * Requête de connexion utilisateur
 */
export const LoginRequestSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
