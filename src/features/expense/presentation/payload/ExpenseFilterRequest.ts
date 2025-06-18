import { z } from 'zod';
import { ExpenseCategory } from '@core/config/enums/ExpenseCategory';

export const ExpenseFilterRequestSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  category: z.nativeEnum(ExpenseCategory).optional(),
  employeeId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
});

export type ExpenseFilterRequest = z.infer<typeof ExpenseFilterRequestSchema>;
