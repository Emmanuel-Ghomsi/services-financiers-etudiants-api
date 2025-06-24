import { z } from 'zod';
import { RoleEnum } from '@prisma/client';

/**
 * Requête pour ajouter un rôle à un utilisateur
 */
export const AddRoleRequestSchema = z.object({
  roles: z.array(z.nativeEnum(RoleEnum), {
    errorMap: () => ({ message: 'Rôle invalide' }),
  }),
});

export type AddRoleRequest = z.infer<typeof AddRoleRequestSchema>;
