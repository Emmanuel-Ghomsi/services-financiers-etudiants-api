import { z } from 'zod';

export const RejectExpenseRequestSchema = z.object({
  reason: z.string(),
});

export type RejectExpenseRequest = z.infer<typeof RejectExpenseRequestSchema>;
