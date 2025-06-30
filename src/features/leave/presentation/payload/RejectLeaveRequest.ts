import { z } from 'zod';

export const RejectLeaveRequestSchema = z.object({
  reason: z.string(),
});

export type RejectLeaveRequest = z.infer<typeof RejectLeaveRequestSchema>;
