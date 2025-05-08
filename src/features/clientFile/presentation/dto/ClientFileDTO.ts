/**
 * DTO de réponse pour une fiche client
 */
export interface ClientFileDTO {
  id: string;
  reference: string;
  clientCode: string;
  reason: string;
  clientType: string;
  nonResident: boolean;
  status: string;
  creatorId: string;
  creatorUsername: string | null;

  lastName?: string | null;
  firstName?: string | null;
  email?: string | null;
  maidenName?: string | null;
  birthDate?: string | null;
  birthCity?: string | null;
  birthCountry?: string | null;
  identityType?: string | null;
  identityNumber?: string | null;
  nationality?: string | null;
  legalRepresentative?: string | null;
  hasBankAccount?: boolean | null;
  taxIdNumber?: string | null;
  taxCountry?: string | null;

  homeAddress?: string | null;
  postalAddress?: string | null;
  taxResidenceCountry?: string | null;
  phoneNumbers?: string | null;

  profession?: string | null;
  businessSector?: string | null;
  activityStartDate?: string | null;
  activityArea?: string | null;

  incomeSources?: string | null;
  monthlyIncome?: number | null;
  incomeCurrency?: string | null;
  fundsOriginDestination?: string | null;
  assets?: string | null;

  hasInternationalOps?: boolean | null;
  transactionCountries?: string | null;
  transactionCurrencies?: string | null;

  offeredAccounts?: string | null;
  expectedOperations?: string | null;
  creditAmount?: string | null;
  debitAmount?: string | null;

  isPEP?: boolean | null;
  pepType?: string | null;
  pepMandate?: string | null;
  pepEndDate?: string | null;
  pepLinkType?: string | null;
  pepLastName?: string | null;
  pepFirstName?: string | null;
  pepBirthDate?: string | null;
  pepBirthPlace?: string | null;

  riskLevel?: string | null;
  classificationSource?: string | null;
  degradationReason?: string | null;
  fatcaStatus?: string | null;
  hasUsIndications?: boolean | null;
  usIndicationsDetails?: string | null;

  validatorAdminId?: string | null;
  validatorSuperAdminId?: string | null;
  validationDateAdmin?: string | null;
  validationDateSuper?: string | null;
  rejectionReason?: string | null;

  fundSources?: string[] | null;
  fundProviderName?: string | null;
  fundProviderRelation?: string | null;
  fundDonationExplanation?: string | null;

  createdAt: string;
  updatedAt: string;
}
