import { z } from 'zod';

export const UserListRequestSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  filters: z
    .object({
      username: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
});

export type UserListRequest = z.infer<typeof UserListRequestSchema>;
