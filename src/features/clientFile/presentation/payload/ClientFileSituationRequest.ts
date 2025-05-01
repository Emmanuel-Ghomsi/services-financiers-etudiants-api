import { z } from 'zod';

export const ClientFileSituationRequestSchema = z.object({
  incomeSources: z.string().optional(),
  monthlyIncome: z.coerce.number().optional(),
  incomeCurrency: z.string().optional(),
  fundsOriginDestination: z.string().optional(),
  assets: z.string().optional(),
});

export type ClientFileSituationRequest = z.infer<
  typeof ClientFileSituationRequestSchema
>;
