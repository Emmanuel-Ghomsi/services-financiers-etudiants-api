import { SalaryAdvanceStatus } from '@prisma/client';

export class SalaryAdvanceEntity {
  constructor(partial: Partial<SalaryAdvanceEntity>) {
    Object.assign(this, partial);
  }

  id?: string;
  amount!: number;
  reason!: string;
  requestedDate!: Date;
  status!: SalaryAdvanceStatus;
  employeeId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
