import { z } from 'zod';

export const GetMediaRequestSchema = z.object({
  filename: z
    .string()
    .uuid()
    .or(z.string().regex(/^[\w,\s-]+\.[A-Za-z]{3,4}$/)), // soit UUID, soit nom de fichier valide
});

export type GetMediaRequest = z.infer<typeof GetMediaRequestSchema>;
