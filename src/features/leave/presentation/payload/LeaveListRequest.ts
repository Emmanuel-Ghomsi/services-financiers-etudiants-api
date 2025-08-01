import { z } from 'zod';
import { LeaveType, ValidationStatus } from '@prisma/client';

export const LeaveListRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  filters: z
    .object({
      employeeUsername: z.string().optional(),
      leaveType: z.nativeEnum(LeaveType).optional(),
      status: z.nativeEnum(ValidationStatus).optional(),
      startDate: z.string().datetime().optional(), // format ISO
      endDate: z.string().datetime().optional(),
    })
    .optional(),
});

export type LeaveListRequest = z.infer<typeof LeaveListRequestSchema>;
