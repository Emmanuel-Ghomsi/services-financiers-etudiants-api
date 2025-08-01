import { ValidationStatus } from '@prisma/client';
import { z } from 'zod';

export const UpdateLeaveStatusRequestSchema = z.object({
  status: z.nativeEnum(ValidationStatus),
});

export type UpdateLeaveStatusRequest = z.infer<
  typeof UpdateLeaveStatusRequestSchema
>;
