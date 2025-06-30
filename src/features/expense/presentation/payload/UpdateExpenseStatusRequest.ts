import { ValidationStatus } from '@prisma/client';
import { z } from 'zod';

export const UpdateExpenseStatusRequestSchema = z.object({
  status: z.nativeEnum(ValidationStatus),
});

export type UpdateExpenseStatusRequest = z.infer<
  typeof UpdateExpenseStatusRequestSchema
>;
