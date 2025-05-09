import { z } from 'zod';

export const ClientFileInternationalRequestSchema = z.object({
  hasInternationalOps: z.boolean().optional(),
  transactionCountries: z.string().optional(),
  transactionCurrencies: z.string().optional(),
});

export type ClientFileInternationalRequest = z.infer<
  typeof ClientFileInternationalRequestSchema
>;
