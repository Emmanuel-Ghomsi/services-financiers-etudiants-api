import { z } from 'zod';

export const ClientFileIdentityRequestSchema = z.object({
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  email: z.string().optional(),
  maidenName: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  birthCity: z.string().optional(),
  birthCountry: z.string().optional(),
  identityType: z.string().optional(),
  identityNumber: z.string().optional(),
  nationality: z.string().optional(),
  legalRepresentative: z.string().optional(),
  hasBankAccount: z.boolean().optional(),
  taxIdNumber: z.string().optional(),
  taxCountry: z.string().optional(),
});

export type ClientFileIdentityRequest = z.infer<
  typeof ClientFileIdentityRequestSchema
>;
