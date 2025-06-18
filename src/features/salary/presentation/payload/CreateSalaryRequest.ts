import { z } from 'zod';
import { SalaryPaymentMode } from '@core/config/enums/SalaryPaymentMode';

export const CreateSalaryRequestSchema = z.object({
  employeeId: z.string().uuid(),
  grossSalary: z.number().nonnegative(),
  deductions: z.number().nonnegative().default(0),
  advances: z.number().nonnegative().default(0),
  paymentMode: z.nativeEnum(SalaryPaymentMode),
  paymentDate: z.coerce.date(),
});

export type CreateSalaryRequest = z.infer<typeof CreateSalaryRequestSchema>;
