import { z } from 'zod';

export const ClientFileOperationRequestSchema = z.object({
  expectedOperations: z.string().optional(),
  creditAmount: z.string().optional(),
  debitAmount: z.string().optional(),
});

export type ClientFileOperationRequest = z.infer<
  typeof ClientFileOperationRequestSchema
>;
