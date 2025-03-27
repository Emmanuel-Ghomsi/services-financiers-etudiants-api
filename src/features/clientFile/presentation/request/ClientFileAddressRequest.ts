import { z } from 'zod';

export const ClientFileAddressRequestSchema = z.object({
  homeAddress: z.string().optional(),
  postalAddress: z.string().optional(),
  taxResidenceCountry: z.string().optional(),
  phoneNumbers: z.string().optional(),
});

export type ClientFileAddressRequest = z.infer<
  typeof ClientFileAddressRequestSchema
>;
