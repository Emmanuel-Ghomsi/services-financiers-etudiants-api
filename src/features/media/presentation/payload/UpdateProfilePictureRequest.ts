import { z } from 'zod';

export const UpdateProfilePictureRequestSchema = z.object({
  file: z.any(), // fichier uploadé via multipart
});

export type UpdateProfilePictureRequest = z.infer<
  typeof UpdateProfilePictureRequestSchema
>;
