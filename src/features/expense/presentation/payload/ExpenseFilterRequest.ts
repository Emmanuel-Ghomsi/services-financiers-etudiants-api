import { z } from 'zod';
import { ExpenseCategory } from '@core/config/enums/ExpenseCategory';

/**
 * Permet de filtrer les dépenses par date, catégorie, employé ou projet
 * Supporte les dates simples au format YYYY-MM-DD
 */
export const ExpenseFilterRequestSchema = z.object({
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'startDate doit être au format YYYY-MM-DD',
    })
    .transform((str) => new Date(str))
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'endDate doit être au format YYYY-MM-DD',
    })
    .transform((str) => new Date(str))
    .optional(),
  category: z.nativeEnum(ExpenseCategory).optional(),
  employeeId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
});

export type ExpenseFilterRequest = z.infer<typeof ExpenseFilterRequestSchema>;
