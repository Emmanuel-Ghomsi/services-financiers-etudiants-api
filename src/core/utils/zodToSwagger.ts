import { zodToJsonSchema } from 'zod-to-json-schema';
import { swaggerSchemasMap } from '@core/config/swagger/swaggerSchemasMap';

export function zodToSwaggerSchema(name: string) {
  const schema = swaggerSchemasMap[name];

  if (!schema) {
    throw new Error(`❌ Schéma "${name}" non trouvé dans swaggerSchemasMap.ts`);
  }

  const jsonSchema = zodToJsonSchema(schema, name);
  const definition = jsonSchema.definitions?.[name] || jsonSchema;

  return definition;
}
