import { z } from 'zod';

export const ExpenseStatsDTOSchema = z.object({
  totalYear: z.number(),
  monthlyTotals: z.record(z.string(), z.number()),
  byCategory: z.record(z.string(), z.number()),
});

export type ExpenseStatsDTO = z.infer<typeof ExpenseStatsDTOSchema>;
