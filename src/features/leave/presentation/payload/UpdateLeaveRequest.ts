import { z } from 'zod';
import { LeaveStatus } from '@core/config/enums/LeaveStatus';

export const UpdateLeaveRequestSchema = z.object({
  status: z.nativeEnum(LeaveStatus),
  reviewedBy: z.string().uuid().optional(), // RH ou supérieur
  comment: z.string().optional(), // motif de rejet si applicable
});

export type UpdateLeaveRequest = z.infer<typeof UpdateLeaveRequestSchema>;
