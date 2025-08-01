import { PrismaClient, ValidationStatus, LeaveType } from '@prisma/client';
import { LeaveEntity } from '../entity/LeaveEntity';
import { LeaveDAO } from './LeaveDAO';
import { LeaveStatsDTO } from '@features/leave/presentation/dto/LeaveStatsDTO';
import { LeaveBalanceDTO } from '@features/leave/presentation/dto/LeaveBalanceDTO';

const prisma = new PrismaClient();

export class LeaveDAOImpl implements LeaveDAO {
  private toEntity(record: any): LeaveEntity {
    return new LeaveEntity({
      id: record.id,
      employeeId: record.employeeId,
      leaveType: record.leaveType,
      startDate: new Date(record.startDate),
      endDate: new Date(record.endDate),
      comment: record.comment,
      status: record.status,
      validatedByAdmin: record.validateByAdmin,
      validatedBySuperAdmin: record.validateBySuperAdmin,
      rejectedReason: record.rejectedReason,
      reviewedBy: record.reviewedBy,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  async create(data: Partial<LeaveEntity>): Promise<LeaveEntity> {
    const created = await prisma.leave.create({
      data: {
        employeeId: data.employeeId!,
        leaveType: data.leaveType as LeaveType,
        startDate: data.startDate!,
        endDate: data.endDate!,
        comment: data.comment ?? null,
        status: data.status,
        reviewedBy: data.reviewedBy ?? null,
      },
    });
    return this.toEntity(created);
  }

  async findById(id: string): Promise<LeaveEntity | null> {
    const result = await prisma.leave.findUnique({ where: { id } });
    return result ? this.toEntity(result) : null;
  }

  async findAll(): Promise<LeaveEntity[]> {
    const results = await prisma.leave.findMany({
      orderBy: { startDate: 'desc' },
    });
    return results.map(this.toEntity);
  }

  async findByEmployee(employeeId: string): Promise<LeaveEntity[]> {
    const results = await prisma.leave.findMany({
      where: { employeeId },
      orderBy: { startDate: 'desc' },
    });
    return results.map(this.toEntity);
  }

  async update(id: string, data: Partial<LeaveEntity>): Promise<LeaveEntity> {
    const updated = await prisma.leave.update({
      where: { id },
      data: {
        leaveType: data.leaveType as LeaveType,
        startDate: data.startDate,
        endDate: data.endDate,
        comment: data.comment,
        status: data.status,
        reviewedBy: data.reviewedBy,
      },
    });
    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.leave.delete({ where: { id } });
  }

  async findAndCount(
    offset: number,
    limit: number,
    filters?: {
      employeeUsername?: string;
      leaveType?: LeaveType;
      status?: ValidationStatus;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<[LeaveEntity[], number]> {
    const whereClause: any = {};

    if (filters?.leaveType) {
      whereClause.leaveType = filters.leaveType;
    }
    if (filters?.status) {
      whereClause.status = filters.status;
    }
    if (filters?.startDate || filters?.endDate) {
      whereClause.startDate = {};
      if (filters.startDate) {
        whereClause.startDate.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        whereClause.startDate.lte = new Date(filters.endDate);
      }
    }

    if (filters?.employeeUsername) {
      whereClause.employee = {
        user: {
          username: filters.employeeUsername,
        },
      };
    }

    const [items, total] = await prisma.$transaction([
      prisma.leave.findMany({
        skip: offset,
        take: limit,
        where: whereClause,
        orderBy: { startDate: 'desc' },
        include: {
          employee: true,
        },
      }),
      prisma.leave.count({
        where: whereClause,
      }),
    ]);

    return [items.map(this.toEntity), total];
  }

  async getLeaveBalance(
    employeeId: string,
    year: number
  ): Promise<LeaveBalanceDTO> {
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
    const currentDate = new Date();

    // 2.5 jours par mois jusqu’à aujourd’hui ou décembre
    const monthsWorked = Math.min(
      12,
      currentDate.getFullYear() === year ? currentDate.getMonth() + 1 : 12
    );
    const accruedDays = monthsWorked * 2.5;

    const leaves = await prisma.leave.findMany({
      where: {
        employeeId,
        status: ValidationStatus.VALIDATED,
        startDate: { lte: endOfYear },
        endDate: { gte: startOfYear },
      },
    });

    let takenDays = 0;

    for (const leave of leaves) {
      const from = new Date(leave.startDate);
      const to = new Date(leave.endDate);

      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        if (d.getFullYear() === year) {
          takenDays++;
        }
      }
    }

    return {
      year,
      accruedDays,
      takenDays,
      remainingDays: accruedDays - takenDays,
    };
  }

  async getAllLeaveBalances(): Promise<
    { employeeId: string; acquired: number; taken: number; remaining: number }[]
  > {
    const approvedLeaves = await prisma.leave.findMany({
      where: { status: ValidationStatus.VALIDATED },
    });

    const grouped: Record<string, number> = {};

    for (const leave of approvedLeaves) {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const days =
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

      grouped[leave.employeeId] = (grouped[leave.employeeId] || 0) + days;
    }

    const now = new Date();
    const months = now.getMonth() + 1 + now.getFullYear() * 12;
    const acquiredPerEmployee = Math.floor(months * 2.5); // règle générale

    return Object.entries(grouped).map(([employeeId, taken]) => ({
      employeeId,
      acquired: acquiredPerEmployee,
      taken,
      remaining: acquiredPerEmployee - taken,
    }));
  }

  async getAbsenceCalendar(): Promise<
    {
      date: string;
      absences: {
        employeeId: string;
        leaveType: string;
      }[];
    }[]
  > {
    const leaves = await prisma.leave.findMany({
      where: { status: ValidationStatus.VALIDATED },
      orderBy: { startDate: 'asc' },
    });

    const resultMap: Record<
      string,
      { employeeId: string; leaveType: string }[]
    > = {};

    for (const leave of leaves) {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateKey = d.toISOString().split('T')[0];
        if (!resultMap[dateKey]) resultMap[dateKey] = [];

        resultMap[dateKey].push({
          employeeId: leave.employeeId,
          leaveType: leave.leaveType,
        });
      }
    }

    return Object.entries(resultMap).map(([date, absences]) => ({
      date,
      absences,
    }));
  }

  async getStatistics(
    year: number,
    employeeId?: string
  ): Promise<LeaveStatsDTO> {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);

    const leaves = await prisma.leave.findMany({
      where: {
        status: ValidationStatus.VALIDATED,
        startDate: { lte: end },
        endDate: { gte: start },
        ...(employeeId ? { employeeId } : {}),
      },
    });

    let totalApprovedDays = 0;
    const monthlyDaysTaken: Record<string, number> = {};
    const byType: Record<string, number> = {};

    for (const leave of leaves) {
      const from = new Date(leave.startDate);
      const to = new Date(leave.endDate);

      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        if (d.getFullYear() !== year) continue;

        const month = `${d.getMonth() + 1}`.padStart(2, '0');
        monthlyDaysTaken[month] = (monthlyDaysTaken[month] || 0) + 1;
        totalApprovedDays += 1;

        const type = leave.leaveType;
        byType[type] = (byType[type] || 0) + 1;
      }
    }

    return { totalApprovedDays, monthlyDaysTaken, byType };
  }

  async validateByAdmin(salaryId: string, validatorId: string): Promise<void> {
    await prisma.leave.update({
      where: { id: salaryId },
      data: {
        validatedByAdmin: validatorId,
        status: ValidationStatus.AWAITING_SUPERADMIN_VALIDATION,
      },
    });
  }

  async validateBySuperAdmin(
    salaryId: string,
    validatorId: string
  ): Promise<void> {
    await prisma.leave.update({
      where: { id: salaryId },
      data: {
        validatedBySuperAdmin: validatorId,
        status: ValidationStatus.VALIDATED,
      },
    });
  }

  async reject(salaryId: string, reason: string): Promise<void> {
    await prisma.leave.update({
      where: { id: salaryId },
      data: {
        status: ValidationStatus.REJECTED,
        rejectedReason: reason,
      },
    });
  }

  async updateStatus(
    id: string,
    status: ValidationStatus
  ): Promise<LeaveEntity> {
    const updated = await prisma.leave.update({
      where: { id },
      data: { status },
    });

    return new LeaveEntity(updated);
  }
}
