import { z } from 'zod';

export const ClientFileServicesRequestSchema = z.object({
  offeredAccounts: z.string().optional(),
});

export type ClientFileServicesRequest = z.infer<
  typeof ClientFileServicesRequestSchema
>;
