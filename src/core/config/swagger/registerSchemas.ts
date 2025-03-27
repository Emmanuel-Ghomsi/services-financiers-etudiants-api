import { FastifyInstance } from 'fastify';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { swaggerSchemasMap } from './swaggerSchemasMap';

/**
 * Enregistre tous les schémas Zod dans Fastify en tant que schémas Swagger JSON
 */
export const registerSchemas = (fastify: FastifyInstance) => {
  Object.entries(swaggerSchemasMap).forEach(([name, schema]) => {
    const jsonSchema = zodToJsonSchema(schema, name);
    const definition = jsonSchema.definitions?.[name] || jsonSchema;
    fastify.addSchema({
      ...definition,
      $id: name,
    });
  });
};
