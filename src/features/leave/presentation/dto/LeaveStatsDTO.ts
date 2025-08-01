import { z } from 'zod';

export const LeaveStatsDTOSchema = z.object({
  totalApprovedDays: z.number(),
  monthlyDaysTaken: z.record(z.string(), z.number()), // "01" à "12"
  byType: z.record(z.string(), z.number()), // ANNUAL, SICK, EXCEPTIONAL
});

export type LeaveStatsDTO = z.infer<typeof LeaveStatsDTOSchema>;
