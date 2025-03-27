import { z } from 'zod';

/**
 * Étape de création de la fiche client
 */
export const ClientFileCreateRequestSchema = z.object({
  reference: z
    .string()
    .regex(/^REF\/SFE\/\d{4}\/DO$/, 'Format de référence invalide'),
  clientCode: z.string().min(3),
  reason: z.enum(['Entrée en relation', 'Revue périodique']),
  clientType: z.enum(['Titulaire', 'Mandataire']),
  nonResident: z.boolean(),
});

export type ClientFileCreateRequest = z.infer<
  typeof ClientFileCreateRequestSchema
>;
