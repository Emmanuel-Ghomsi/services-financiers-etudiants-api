import { z } from 'zod';

export const ClientFileActivityRequestSchema = z.object({
  profession: z.string().optional(),
  businessSector: z.string().optional(),
  activityStartDate: z.coerce.date().optional(),
  activityArea: z.string().optional(),
});

export type ClientFileActivityRequest = z.infer<
  typeof ClientFileActivityRequestSchema
>;
