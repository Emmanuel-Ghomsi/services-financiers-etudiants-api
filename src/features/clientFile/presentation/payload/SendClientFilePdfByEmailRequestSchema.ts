import { z } from 'zod';
import { Buffer } from 'buffer';

export const SendClientFilePdfByEmailRequestSchema = z.object({
  pdf: z.instanceof(Buffer, {
    message: 'Fichier PDF requis',
  }),
});

export type SendClientFilePdfByEmailRequest = z.infer<
  typeof SendClientFilePdfByEmailRequestSchema
>;
