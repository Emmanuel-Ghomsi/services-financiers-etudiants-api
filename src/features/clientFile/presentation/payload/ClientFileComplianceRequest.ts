import { z } from 'zod';

export const ClientFileComplianceRequestSchema = z.object({
  riskLevel: z.string().optional(),
  classificationSource: z.string().optional(),
  degradationReason: z.string().optional(),
  fatcaStatus: z.string().optional(),
  hasUsIndications: z.boolean().optional(),
  usIndicationsDetails: z.string().optional(),
});

export type ClientFileComplianceRequest = z.infer<
  typeof ClientFileComplianceRequestSchema
>;
