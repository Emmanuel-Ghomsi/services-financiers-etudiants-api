import { LeaveEntity } from '@features/leave/data/entity/LeaveEntity';
import { LeaveDTO } from '../dto/LeaveDTO';

export function toLeaveDTO(entity: LeaveEntity): LeaveDTO {
  return {
    id: entity.id,
    employeeId: entity.employeeId,
    leaveType: entity.leaveType,
    startDate: entity.startDate.toISOString().split('T')[0],
    endDate: entity.endDate.toISOString().split('T')[0],
    comment: entity.comment ?? undefined,
    status: entity.status,
    reviewedBy: entity.reviewedBy ?? undefined,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function fromLeaveDTO(dto: LeaveDTO): LeaveEntity {
  return new LeaveEntity({
    id: dto.id,
    employeeId: dto.employeeId,
    leaveType: dto.leaveType,
    startDate: new Date(dto.startDate),
    endDate: new Date(dto.endDate),
    comment: dto.comment ?? null,
    status: dto.status,
    reviewedBy: dto.reviewedBy ?? null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  });
}
