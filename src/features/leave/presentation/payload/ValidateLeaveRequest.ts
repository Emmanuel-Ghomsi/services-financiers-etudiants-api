import { z } from 'zod';

export const ValidateLeaveRequestSchema = z.object({
  validatorId: z.string().uuid(),
});

export type ValidateLeaveRequest = z.infer<typeof ValidateLeaveRequestSchema>;
