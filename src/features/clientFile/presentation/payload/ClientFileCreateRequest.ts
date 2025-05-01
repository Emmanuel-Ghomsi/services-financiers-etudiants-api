import { z } from 'zod';

/**
 * Étape de création de la fiche client
 */
export const ClientFileCreateRequestSchema = z.object({
  reason: z.enum(['Entrée en relation', 'Revue périodique']),
  clientType: z.enum(['Titulaire', 'Mandataire']),
  nonResident: z.boolean(),
});

export type ClientFileCreateRequest = z.infer<
  typeof ClientFileCreateRequestSchema
>;
