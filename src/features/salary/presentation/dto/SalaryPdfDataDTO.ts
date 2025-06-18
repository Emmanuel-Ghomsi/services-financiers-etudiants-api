import { z } from 'zod';

export const SalaryPdfDataDTOSchema = z.object({
  employeeId: z.string().uuid(),
  grossSalary: z.number(),
  deductions: z.number(),
  advances: z.number(),
  netSalary: z.number(),
  paymentDate: z.string().datetime(),
  paymentMode: z.string(),
  createdAt: z.string().datetime(),
});

export type SalaryPdfDataDTO = z.infer<typeof SalaryPdfDataDTOSchema>;
