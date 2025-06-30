import { z } from 'zod';
import { ValidationStatus } from '@prisma/client';

export const UpdateLeaveRequestSchema = z.object({
  status: z.nativeEnum(ValidationStatus),
  reviewedBy: z.string().uuid().optional(), // RH ou supérieur
  comment: z.string().optional(), // motif de rejet si applicable
});

export type UpdateLeaveRequest = z.infer<typeof UpdateLeaveRequestSchema>;
