import { z } from 'zod';

export const ExpenseStatsRequestSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
});

export type ExpenseStatsRequest = z.infer<typeof ExpenseStatsRequestSchema>;
