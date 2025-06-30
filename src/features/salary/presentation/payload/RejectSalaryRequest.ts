import { z } from 'zod';

export const RejectSalaryRequestSchema = z.object({
  reason: z.string(),
});

export type RejectSalaryRequest = z.infer<typeof RejectSalaryRequestSchema>;
