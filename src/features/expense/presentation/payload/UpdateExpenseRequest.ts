import { z } from 'zod';
import { ExpenseCategory, ExpenseCategoryGroup } from '@prisma/client';

export const UpdateExpenseRequestSchema = z.object({
  amount: z.coerce.number().positive().optional(),
  date: z.coerce.date().optional(),
  category: z.nativeEnum(ExpenseCategory).optional(),
  group: z.nativeEnum(ExpenseCategoryGroup).optional(),
  description: z.string().optional(),
  fileUrl: z.string().url().optional(),
  employeeId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
});

export type UpdateExpenseRequest = z.infer<typeof UpdateExpenseRequestSchema>;
