import { z } from 'zod';
import { SalaryPaymentMode } from '@core/config/enums/SalaryPaymentMode';

export const UpdateSalaryRequestSchema = z.object({
  grossSalary: z.number().nonnegative().optional(),
  deductions: z.number().nonnegative().optional(),
  advances: z.number().nonnegative().optional(),
  paymentMode: z.nativeEnum(SalaryPaymentMode).optional(),
  paymentDate: z.coerce.date().optional(),
  payslipUrl: z.string().url().optional().nullable(),
});

export type UpdateSalaryRequest = z.infer<typeof UpdateSalaryRequestSchema>;
