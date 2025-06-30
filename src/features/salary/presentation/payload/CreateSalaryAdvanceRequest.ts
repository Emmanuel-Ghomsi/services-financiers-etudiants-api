import { z } from 'zod';

export const CreateSalaryAdvanceRequestSchema = z.object({
  amount: z.number().positive(),
  reason: z.string().min(3),
  requestedDate: z.coerce.date(),
  employeeId: z.string().uuid(),
  userId: z.string().uuid(),
});

export type CreateSalaryAdvanceRequest = z.infer<
  typeof CreateSalaryAdvanceRequestSchema
>;
