import { z } from 'zod';
import { ExpenseDTOSchema } from './ExpenseDTO';

export const ExpensePaginationDTOSchema = z.object({
  items: z.array(ExpenseDTOSchema),
  currentPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  pageLimit: z.number(),
});

export type ExpensePaginationDTO = z.infer<typeof ExpensePaginationDTOSchema>;
