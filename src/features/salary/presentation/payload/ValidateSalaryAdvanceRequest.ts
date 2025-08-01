import { z } from 'zod';

export const ValidateSalaryAdvanceRequestSchema = z.object({
  validatorId: z.string().uuid(),
});

export type ValidateSalaryAdvanceRequest = z.infer<
  typeof ValidateSalaryAdvanceRequestSchema
>;
