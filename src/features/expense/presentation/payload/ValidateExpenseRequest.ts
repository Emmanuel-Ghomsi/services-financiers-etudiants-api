import { z } from 'zod';

export const ValidateExpenseRequestSchema = z.object({
  validatorId: z.string().uuid(),
});

export type ValidateExpenseRequest = z.infer<
  typeof ValidateExpenseRequestSchema
>;
