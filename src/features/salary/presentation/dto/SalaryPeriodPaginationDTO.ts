import { z } from 'zod';
import { SalaryPeriodDTOSchema } from './SalaryPeriodDTO';

export const SalaryPeriodPaginationDTOSchema = z.object({
  items: z.array(SalaryPeriodDTOSchema),
  currentPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  pageLimit: z.number(),
});

export type SalaryPeriodPaginationDTO = z.infer<
  typeof SalaryPeriodPaginationDTOSchema
>;
