import { SalaryPaymentMode } from '@prisma/client';
import { z } from 'zod';

export const CreateSalaryRequestSchema = z.object({
  employeeId: z.string().uuid(),
  grossSalary: z.number().nonnegative(),
  deductions: z.number().nonnegative().default(0),
  advances: z.number().nonnegative().default(0),
  paymentMode: z.nativeEnum(SalaryPaymentMode),
  paymentDate: z.coerce.date(),
});

export type CreateSalaryRequest = z.infer<typeof CreateSalaryRequestSchema>;
