import { z } from 'zod';

/**
 * Requête de listing + filtrage des fiches clients
 */
export const ClientFileListRequestSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
  pageLimit: z.number().min(1).max(100).default(10),
  filters: z
    .object({
      reference: z.string().optional(),
      lastName: z.string().optional(),
      clientCode: z.string().optional(),
      status: z.string().optional(),
      email: z.string().optional(),
    })
    .optional(),
});

export type ClientFileListRequest = z.infer<typeof ClientFileListRequestSchema>;
