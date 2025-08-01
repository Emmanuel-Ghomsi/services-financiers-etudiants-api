import { z } from 'zod';

export const SalaryPeriodDTOSchema = z.object({
  employeeId: z.string().uuid(),
  grossSalary: z.number(),
  deductions: z.number(),
  advances: z.number(),
  netSalary: z.number(),
  paymentDate: z.string().datetime(),
});

export type SalaryPeriodDTO = z.infer<typeof SalaryPeriodDTOSchema>;
