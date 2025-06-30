import { z } from 'zod';

export const RejectSalaryAdvanceRequestSchema = z.object({
  reason: z.string(),
});

export type RejectSalaryAdvanceRequest = z.infer<
  typeof RejectSalaryAdvanceRequestSchema
>;
