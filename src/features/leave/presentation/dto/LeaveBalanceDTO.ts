import { z } from 'zod';

export const LeaveBalanceDTOSchema = z.object({
  year: z.number(),
  accruedDays: z.number(),
  takenDays: z.number(),
  remainingDays: z.number(),
});

export type LeaveBalanceDTO = z.infer<typeof LeaveBalanceDTOSchema>;
