export class LeaveEntity {
  constructor(params: {
    id: string;
    employeeId: string;
    leaveType: string;
    startDate: Date;
    endDate: Date;
    comment: string | null;
    status: string;
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
  status!: string;
  reviewedBy!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
