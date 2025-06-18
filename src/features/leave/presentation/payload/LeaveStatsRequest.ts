import { z } from 'zod';

export const LeaveStatsRequestSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  employeeId: z.string().uuid().optional(),
});

export type LeaveStatsRequest = z.infer<typeof LeaveStatsRequestSchema>;
