import { z } from 'zod';
import { LeaveType } from '@core/config/enums/LeaveType';

export const CreateLeaveRequestSchema = z.object({
  employeeId: z.string().uuid(),
  leaveType: z.nativeEnum(LeaveType),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  comment: z.string().max(500).optional(),
  userId: z.string().uuid(),
});

export type CreateLeaveRequest = z.infer<typeof CreateLeaveRequestSchema>;
