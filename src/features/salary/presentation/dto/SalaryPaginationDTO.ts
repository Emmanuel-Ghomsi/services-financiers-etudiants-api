import { z } from 'zod';
import { SalaryDTOSchema } from './SalaryDTO';

export const SalaryPaginationDTOSchema = z.object({
  items: z.array(SalaryDTOSchema),
  currentPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  pageLimit: z.number(),
});

export type SalaryPaginationDTO = z.infer<typeof SalaryPaginationDTOSchema>;
