import { ValidationStatus } from '@prisma/client';

export class LeaveEntity {
  constructor(params: {
    id: string;
    employeeId: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    comment: string | null;
    status: ValidationStatus;
    validatedByAdmin?: string | null;
    validatedBySuperAdmin?: string | null;
    rejectedReason?: string | null;
    reviewedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    Object.assign(this, params);
  }

  id!: string;
  employeeId!: string;
  leaveType!: string;
  startDate!: Date;
  endDate!: Date;
  comment!: string | null;
  status!: ValidationStatus;
  validatedByAdmin?: string | null;
  validatedBySuperAdmin?: string | null;
  rejectedReason?: string | null;
  reviewedBy!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
