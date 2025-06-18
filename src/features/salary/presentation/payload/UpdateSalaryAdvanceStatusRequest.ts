import { SalaryAdvanceStatus } from '@prisma/client';
import { z } from 'zod';

export const UpdateSalaryAdvanceStatusRequestSchema = z.object({
  status: z.nativeEnum(SalaryAdvanceStatus),
});

export type UpdateSalaryAdvanceStatusRequest = z.infer<
  typeof UpdateSalaryAdvanceStatusRequestSchema
>;
