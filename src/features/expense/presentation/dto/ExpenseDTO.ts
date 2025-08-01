import { z } from 'zod';
import {
  ExpenseCategory,
  ExpenseCategoryGroup,
  ValidationStatus,
} from '@prisma/client';

export const ExpenseDTOSchema = z.object({
  id: z.string().uuid(),
  amount: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // format ISO YYYY-MM-DD
  category: z.nativeEnum(ExpenseCategory),
  group: z.nativeEnum(ExpenseCategoryGroup),
  description: z.string().optional(),
  fileUrl: z.string().optional(),
  employeeId: z.string().uuid(),
  status: z.nativeEnum(ValidationStatus),
  creatorId: z.string().uuid().optional(),
  validatedByAdmin: z.string().optional(),
  validatedBySuperAdmin: z.string().optional(),
  projectId: z.string().uuid().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ExpenseDTO = z.infer<typeof ExpenseDTOSchema>;
