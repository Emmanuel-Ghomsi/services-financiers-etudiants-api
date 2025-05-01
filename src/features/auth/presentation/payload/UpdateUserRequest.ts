import { z } from 'zod';

/**
 * Requête de mise à jour du profil utilisateur
 */
export const UpdateUserRequestSchema = z.object({
  firstname: z.string().min(1, 'Le prénom est requis'),
  lastname: z.string().min(1, 'Le nom est requis'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  address: z.string().min(3, 'Adresse invalide'),
});

export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
