import { z } from 'zod';

export const LeaveDTOSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  leaveType: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  comment: z.string().optional(),
  status: z.string(),
  reviewedBy: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LeaveDTO = z.infer<typeof LeaveDTOSchema>;
