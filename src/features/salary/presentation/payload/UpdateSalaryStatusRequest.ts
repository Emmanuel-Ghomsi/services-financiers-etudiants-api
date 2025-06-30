import { ValidationStatus } from '@prisma/client';
import { z } from 'zod';

export const UpdateSalaryStatusRequestSchema = z.object({
  status: z.nativeEnum(ValidationStatus),
});

export type UpdateSalaryStatusRequest = z.infer<
  typeof UpdateSalaryStatusRequestSchema
>;
