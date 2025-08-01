import { z } from 'zod';

export const LeaveBalanceRequestSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  employeeId: z.string().uuid(),
});

export type LeaveBalanceRequest = z.infer<typeof LeaveBalanceRequestSchema>;
