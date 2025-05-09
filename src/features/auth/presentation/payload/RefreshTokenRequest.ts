import { z } from 'zod';

/**
 * Requête pour rafraîchir un token JWT expiré
 */
export const RefreshTokenRequestSchema = z.object({
  refresh_token: z.string().nonempty('Le refresh token est requis'),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
