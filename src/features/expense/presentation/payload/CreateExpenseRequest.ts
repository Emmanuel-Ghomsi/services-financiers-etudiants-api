import { z } from 'zod';
import { ExpenseCategory, ExpenseCategoryGroup } from '@prisma/client';

export const CreateExpenseRequestSchema = z.object({
  amount: z.coerce
    .number()
    .positive({ message: 'Le montant doit être positif' }),
  date: z.coerce.date({ invalid_type_error: 'Date invalide' }),
  category: z.nativeEnum(ExpenseCategory, {
    errorMap: () => ({ message: 'Catégorie invalide' }),
  }),
  group: z.nativeEnum(ExpenseCategoryGroup, {
    errorMap: () => ({ message: 'Groupe de catégorie invalide' }),
  }),
  description: z.string().optional(),
  fileUrl: z.string().url().optional(),
  employeeId: z.string().uuid(),
  userId: z.string().uuid(),
  projectId: z.string().uuid().optional(),
});

export type CreateExpenseRequest = z.infer<typeof CreateExpenseRequestSchema>;
