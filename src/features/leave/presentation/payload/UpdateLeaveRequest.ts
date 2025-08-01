import { z } from 'zod';
import { LeaveType } from '@prisma/client';

export const UpdateLeaveRequestSchema = z.object({
  leaveType: z.nativeEnum(LeaveType),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  comment: z.string().max(500).optional(),
});

export type UpdateLeaveRequest = z.infer<typeof UpdateLeaveRequestSchema>;
