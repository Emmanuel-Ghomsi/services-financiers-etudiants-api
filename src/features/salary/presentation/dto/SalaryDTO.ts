import { ValidationStatus } from '@prisma/client';
import { z } from 'zod';

export const SalaryDTOSchema = z.object({
  id: z.string().uuid(),
  employeeId: z.string().uuid(),
  grossSalary: z.number(),
  deductions: z.number(),
  advances: z.number(),
  netSalary: z.number(),
  paymentMode: z.string(),
  paymentDate: z.string().datetime(),
  payslipUrl: z.string().url().optional(),
  year: z.string(),
  month: z.string(),
  status: z.nativeEnum(ValidationStatus),
  creatorId: z.string().uuid().optional(),
  validatedByAdmin: z.string().optional(),
  validatedBySuperAdmin: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type SalaryDTO = z.infer<typeof SalaryDTOSchema>;
