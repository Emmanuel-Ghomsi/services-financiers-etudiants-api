import { z } from 'zod';

export const SalaryPeriodFilterRequestSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});

export type SalaryPeriodFilterRequest = z.infer<
  typeof SalaryPeriodFilterRequestSchema
>;
