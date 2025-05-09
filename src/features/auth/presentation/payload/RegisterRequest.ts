import { z } from 'zod';
import { RoleEnum } from '@prisma/client';

/**
 * Schéma Zod pour la validation de la requête d'enregistrement d'un utilisateur
 */
export const RegisterRequestSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur est requis"),
  email: z.string().email('Email invalide'),
  roles: z
    .array(z.nativeEnum(RoleEnum))
    .min(1, 'Au moins un rôle doit être attribué'),
});

/**
 * Type TypeScript dérivé automatiquement du schéma Zod
 */
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
