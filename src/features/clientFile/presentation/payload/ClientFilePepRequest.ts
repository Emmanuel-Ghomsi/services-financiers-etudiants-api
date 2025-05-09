import { z } from 'zod';

export const ClientFilePepRequestSchema = z.object({
  isPEP: z.boolean().optional(),
  pepType: z.string().optional(),
  pepMandate: z.string().optional(),
  pepEndDate: z.coerce.date().optional(),
  pepLinkType: z.string().optional(),
  pepLastName: z.string().optional(),
  pepFirstName: z.string().optional(),
  pepBirthDate: z.coerce.date().optional(),
  pepBirthPlace: z.string().optional(),
});

export type ClientFilePepRequest = z.infer<typeof ClientFilePepRequestSchema>;
