import { z } from 'zod';
import { UserStatus } from '@prisma/client';

/**
 * Requête pour changer le statut d’un compte utilisateur
 */
export const ChangeUserStatusRequestSchema = z.object({
  status: z.nativeEnum(UserStatus, {
    errorMap: () => ({ message: 'Statut invalide' }),
  }),
});

export type ChangeUserStatusRequest = z.infer<
  typeof ChangeUserStatusRequestSchema
>;
