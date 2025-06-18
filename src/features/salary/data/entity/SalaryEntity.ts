export class SalaryEntity {
  constructor(params: {
    id: string;
    employeeId: string;
    grossSalary: number;
    deductions: number;
    advances: number;
    netSalary: number;
    year: string;
    month: string;
    paymentMode: string;
    paymentDate: Date;
    payslipUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    Object.assign(this, params);
  }

  id!: string;
  employeeId!: string;
  grossSalary!: number;
  deductions!: number;
  advances!: number;
  netSalary!: number;
  year!: string;
  month!: string;
  paymentMode!: string;
  paymentDate!: Date;
  payslipUrl!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
