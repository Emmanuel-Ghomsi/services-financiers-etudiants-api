import { z } from 'zod';

export const SalaryAdvanceDTOSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  reason: z.string(),
  requestedDate: z.string().datetime(),
  status: z.string(), // ou z.nativeEnum(SalaryAdvanceStatus) si importé
  employeeId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type SalaryAdvanceDTO = z.infer<typeof SalaryAdvanceDTOSchema>;
