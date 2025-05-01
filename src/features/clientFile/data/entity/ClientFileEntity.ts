import { FileStatus } from '@prisma/client';

export class ClientFileEntity {
  id!: string;
  reference!: string;
  clientCode!: string;
  reason!: string;
  clientType!: string;
  nonResident!: boolean;
  status!: FileStatus;
  creatorId!: string;
  creatorUsername?: string | null;

  lastName?: string | null;
  firstName?: string | null;
  email?: string | null;
  maidenName?: string | null;
  birthDate?: Date | null;
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
  activityStartDate?: Date | null;
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
  pepEndDate?: Date | null;
  pepLinkType?: string | null;
  pepLastName?: string | null;
  pepFirstName?: string | null;
  pepBirthDate?: Date | null;
  pepBirthPlace?: string | null;

  riskLevel?: string | null;
  classificationSource?: string | null;
  degradationReason?: string | null;
  fatcaStatus?: string | null;
  hasUsIndications?: boolean | null;
  usIndicationsDetails?: string | null;

  validatorAdminId?: string | null;
  validatorSuperAdminId?: string | null;
  validationDateAdmin?: Date | null;
  validationDateSuper?: Date | null;
  rejectionReason?: string | null;

  fundSources?: string[] | null;
  fundProviderName?: string | null;
  fundProviderRelation?: string | null;
  fundDonationExplanation?: string | null;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date | null;

  constructor(props: Partial<ClientFileEntity>) {
    Object.assign(this, props);
  }

  canBeEditedBy(userId: string, userRoles: string[]): boolean {
    const isSuperAdmin = userRoles.includes('SUPER_ADMIN');
    if (isSuperAdmin) return true;

    if (this.creatorId === userId) {
      return (
        this.status === 'DRAFT' ||
        this.status === 'IN_PROGRESS' ||
        this.status === 'REJECTED' ||
        this.status === 'BEING_MODIFIED'
      );
    }

    return false;
  }

  canBeDeletedBy(userId: string, userRoles: string[]): boolean {
    const isSuperAdmin = userRoles.includes('SUPER_ADMIN');
    if (isSuperAdmin) return true;

    if (this.creatorId === userId) {
      return (
        this.status === 'DRAFT' ||
        this.status === 'IN_PROGRESS' ||
        this.status === 'REJECTED'
      );
    }

    return false;
  }

  isFullyValidated(): boolean {
    return this.status === 'VALIDATED';
  }

  isPendingValidation(): boolean {
    return (
      this.status === 'AWAITING_ADMIN_VALIDATION' ||
      this.status === 'AWAITING_SUPERADMIN_VALIDATION'
    );
  }

  canBeValidatedBy(role: string): boolean {
    if (role === 'ADMIN') return this.status === 'AWAITING_ADMIN_VALIDATION';
    if (role === 'SUPER_ADMIN')
      return this.status === 'AWAITING_SUPERADMIN_VALIDATION';
    return false;
  }

  isRejected(): boolean {
    return this.status === 'REJECTED';
  }
}
