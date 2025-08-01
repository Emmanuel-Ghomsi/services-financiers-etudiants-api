import { ValidationStatus } from '@prisma/client';
import { z } from 'zod';

export const SalaryAdvanceDTOSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  reason: z.string(),
  requestedDate: z.string().datetime(),
  status: z.nativeEnum(ValidationStatus),
  creatorId: z.string().uuid().optional(),
  validatedByAdmin: z.string().optional(),
  validatedBySuperAdmin: z.string().optional(),
  employeeId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type SalaryAdvanceDTO = z.infer<typeof SalaryAdvanceDTOSchema>;
