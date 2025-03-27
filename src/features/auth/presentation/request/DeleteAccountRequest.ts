import { z } from 'zod';

/**
 * Requête de demande de suppression de compte par l'utilisateur
 */
export const DeleteAccountRequestSchema = z.object({
  reason: z.string().min(10, 'Merci de spécifier la raison de votre demande.'),
});

export type DeleteAccountRequest = z.infer<typeof DeleteAccountRequestSchema>;
