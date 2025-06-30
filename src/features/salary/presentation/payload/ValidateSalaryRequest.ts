import { z } from 'zod';

export const ValidateSalaryRequestSchema = z.object({
  validatorId: z.string().uuid(),
});

export type ValidateSalaryRequest = z.infer<typeof ValidateSalaryRequestSchema>;
