import { z } from 'zod';

export const ClientFileFundOriginRequestSchema = z
  .object({
    fundSources: z
      .array(
        z.enum([
          'épargne personnel',
          'revenue familial',
          'bourse',
          'prêt étudiant',
          'Don financier',
          'Autre',
        ])
      )
      .optional(),

    fundProviderName: z.string().optional(),
    fundProviderRelation: z.string().optional(),
    fundDonationExplanation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.fundSources?.includes('Don financier') &&
      (!data.fundDonationExplanation ||
        data.fundDonationExplanation.trim().length < 3)
    ) {
      ctx.addIssue({
        path: ['fundDonationExplanation'],
        code: z.ZodIssueCode.custom,
        message: 'Vous devez expliquer la provenance du don financier.',
      });
    }
  });

export type ClientFileFundOriginRequest = z.infer<
  typeof ClientFileFundOriginRequestSchema
>;
