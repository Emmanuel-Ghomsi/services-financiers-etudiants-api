import { ValidationStatus } from '@prisma/client';
import { z } from 'zod';

export const LeaveDTOSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  leaveType: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  comment: z.string().optional(),
  status: z.nativeEnum(ValidationStatus),
  reviewedBy: z.string().uuid().optional(),
  validatedByAdmin: z.string().optional(),
  validatedBySuperAdmin: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type LeaveDTO = z.infer<typeof LeaveDTOSchema>;
