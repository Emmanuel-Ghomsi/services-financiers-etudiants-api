import { ValidationStatus } from '@prisma/client';

export class SalaryAdvanceEntity {
  constructor(partial: Partial<SalaryAdvanceEntity>) {
    Object.assign(this, partial);
  }

  id?: string;
  amount!: number;
  reason!: string;
  requestedDate!: Date;
  employeeId!: string;
  status!: ValidationStatus;
  validatedByAdmin?: string | null;
  validatedBySuperAdmin?: string | null;
  rejectedReason?: string | null;
  creatorId?: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
