import { ValidationStatus } from '@prisma/client';
import { z } from 'zod';

export const UpdateSalaryAdvanceStatusRequestSchema = z.object({
  status: z.nativeEnum(ValidationStatus),
});

export type UpdateSalaryAdvanceStatusRequest = z.infer<
  typeof UpdateSalaryAdvanceStatusRequestSchema
>;
