import { z } from 'zod';

export const SalaryPeriodPaginatedRequestSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type SalaryPeriodPaginatedRequest = z.infer<
  typeof SalaryPeriodPaginatedRequestSchema
>;
