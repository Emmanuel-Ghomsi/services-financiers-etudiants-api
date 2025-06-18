import { z } from 'zod';

export const LeaveListRequestSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type LeaveListRequest = z.infer<typeof LeaveListRequestSchema>;
