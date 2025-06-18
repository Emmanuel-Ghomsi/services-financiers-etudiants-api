import { z } from 'zod';
import { LeaveDTOSchema } from './LeaveDTO';

export const LeavePaginationDTOSchema = z.object({
  items: z.array(LeaveDTOSchema),
  currentPage: z.number(),
  totalItems: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  pageLimit: z.number(),
});

export type LeavePaginationDTO = z.infer<typeof LeavePaginationDTOSchema>;
