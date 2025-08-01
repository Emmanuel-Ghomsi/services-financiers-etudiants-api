import { SalaryDTO } from '../dto/SalaryDTO';
import { SalaryEntity } from '@features/salary/data/entity/SalaryEntity';
import { SalaryPdfDataDTO } from '../dto/SalaryPdfDataDTO';

export function toSalaryDTO(entity: SalaryEntity): SalaryDTO {
  return {
    id: entity.id,
    employeeId: entity.employeeId,
    grossSalary: entity.grossSalary,
    deductions: entity.deductions,
    advances: entity.advances,
    netSalary: entity.netSalary,
    paymentMode: entity.paymentMode,
    paymentDate: entity.paymentDate.toISOString().split('T')[0],
    payslipUrl: entity.payslipUrl ?? undefined,
    year: entity.year,
    month: entity.month,
    status: entity.status,
    creatorId: entity.creatorId!,
    validatedByAdmin: entity.validatedByAdmin!,
    validatedBySuperAdmin: entity.validatedBySuperAdmin!,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function fromSalaryDTO(dto: SalaryDTO): SalaryEntity {
  return new SalaryEntity({
    id: dto.id,
    employeeId: dto.employeeId,
    grossSalary: dto.grossSalary,
    deductions: dto.deductions,
    advances: dto.advances,
    netSalary: dto.netSalary,
    paymentMode: dto.paymentMode,
    paymentDate: new Date(dto.paymentDate),
    payslipUrl: dto.payslipUrl ?? null,
    year: dto.year,
    month: dto.month,
    status: dto.status,
    creatorId: dto.creatorId!,
    validatedByAdmin: dto.validatedByAdmin,
    validatedBySuperAdmin: dto.validatedBySuperAdmin,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}

export function toSalaryPdfDataDTO(entity: SalaryEntity): SalaryPdfDataDTO {
  return {
    employeeId: entity.employeeId,
    grossSalary: entity.grossSalary,
    deductions: entity.deductions,
    advances: entity.advances,
    netSalary: entity.netSalary,
    paymentDate: entity.paymentDate.toISOString().split('T')[0],
    paymentMode: entity.paymentMode,
    createdAt: entity.createdAt.toISOString(),
  };
}
