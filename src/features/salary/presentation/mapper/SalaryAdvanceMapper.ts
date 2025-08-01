import { SalaryAdvanceEntity } from '@features/salary/data/entity/SalaryAdvanceEntity';
import { SalaryAdvanceDTO } from '../dto/SalaryAdvanceDTO';

export function toSalaryAdvanceDTO(
  entity: SalaryAdvanceEntity
): SalaryAdvanceDTO {
  return {
    id: entity.id!,
    amount: entity.amount,
    reason: entity.reason,
    requestedDate: entity.requestedDate.toISOString(),
    status: entity.status,
    creatorId: entity.creatorId!,
    validatedByAdmin: entity.validatedByAdmin!,
    validatedBySuperAdmin: entity.validatedBySuperAdmin!,
    employeeId: entity.employeeId,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
