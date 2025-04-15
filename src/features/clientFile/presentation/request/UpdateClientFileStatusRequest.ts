import { z } from 'zod';
import { FileStatus } from '@prisma/client';

export const UpdateClientFileStatusRequestSchema = z.object({
  status: z.nativeEnum(FileStatus),
});

export type UpdateClientFileStatusRequest = z.infer<
  typeof UpdateClientFileStatusRequestSchema
>;
