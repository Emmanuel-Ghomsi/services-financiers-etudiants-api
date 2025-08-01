import { FastifyRequest } from 'fastify/types/request';
import { z, ZodTypeAny } from 'zod';

export function generateClientReference(): string {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `REF/SFE/${randomNumber}/DO`;
}

export function generateClientCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Parse dynamiquement le body, query ou params selon la méthode HTTP
 */
export async function zParse<TSchema extends ZodTypeAny>(
  request: FastifyRequest,
  schema: TSchema
): Promise<z.infer<TSchema>> {
  const source = request.method === 'GET' ? request.query : request.body;
  const result = await schema.safeParseAsync(source);
  if (!result.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(result.error.issues)}`
    );
  }
  return result.data;
}
