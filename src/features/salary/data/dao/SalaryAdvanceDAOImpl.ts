/* eslint-disable no-unused-vars */
import { PrismaClient, ValidationStatus } from '@prisma/client';
import { SalaryAdvanceDAO } from './SalaryAdvanceDAO';
import { SalaryAdvanceEntity } from '../entity/SalaryAdvanceEntity';

export class SalaryAdvanceDAOImpl implements SalaryAdvanceDAO {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: Partial<SalaryAdvanceEntity>
  ): Promise<SalaryAdvanceEntity> {
    const created = await this.prisma.salaryAdvance.create({
      data: {
        amount: data.amount!,
        reason: data.reason!,
        requestedDate: data.requestedDate!,
        status: data.status,
        creatorId: data.creatorId,
        employeeId: data.employeeId!,
      },
    });

    return new SalaryAdvanceEntity(created);
  }

  async findById(id: string): Promise<SalaryAdvanceEntity | null> {
    const found = await this.prisma.salaryAdvance.findUnique({ where: { id } });
    return found ? new SalaryAdvanceEntity(found) : null;
  }

  async findAllByEmployee(employeeId: string): Promise<SalaryAdvanceEntity[]> {
    const results = await this.prisma.salaryAdvance.findMany({
      where: { employeeId },
      orderBy: { requestedDate: 'desc' },
    });
    return results.map((s) => new SalaryAdvanceEntity(s));
  }

  async getApprovedAdvancesByEmployeeAndMonth(
    employeeId: string,
    year: string,
    month: string
  ): Promise<number> {
    const start = new Date(`${year}-${month.toString().padStart(2, '0')}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const results = await this.prisma.salaryAdvance.findMany({
      where: {
        employeeId,
        status: ValidationStatus.VALIDATED,
        requestedDate: {
          gte: start,
          lt: end,
        },
      },
    });

    return results.reduce((sum, adv) => sum + adv.amount, 0);
  }

  async findAll(): Promise<SalaryAdvanceEntity[]> {
    const results = await this.prisma.salaryAdvance.findMany({
      orderBy: { requestedDate: 'desc' },
    });
    return results.map((s) => new SalaryAdvanceEntity(s));
  }

  async update(
    id: string,
    data: Partial<SalaryAdvanceEntity>
  ): Promise<SalaryAdvanceEntity> {
    const updated = await this.prisma.salaryAdvance.update({
      where: { id },
      data: {
        amount: data.amount,
        reason: data.reason,
        requestedDate: data.requestedDate,
        status: data.status,
      },
    });
    return new SalaryAdvanceEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.salaryAdvance.delete({ where: { id } });
  }

  async validateByAdmin(salaryId: string, validatorId: string): Promise<void> {
    await this.prisma.salaryAdvance.update({
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
    await this.prisma.salaryAdvance.update({
      where: { id: salaryId },
      data: {
        validatedBySuperAdmin: validatorId,
        status: ValidationStatus.VALIDATED,
      },
    });
  }

  async reject(salaryId: string, reason: string): Promise<void> {
    await this.prisma.salaryAdvance.update({
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
  ): Promise<SalaryAdvanceEntity> {
    const updated = await this.prisma.salaryAdvance.update({
      where: { id },
      data: { status },
    });

    return new SalaryAdvanceEntity(updated);
  }

  async findApprovedByEmployeeAndMonth(
    employeeId: string,
    year: string,
    month: string
  ): Promise<SalaryAdvanceEntity[]> {
    const start = new Date(`${year}-${month}-01`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const advances = await this.prisma.salaryAdvance.findMany({
      where: {
        employeeId,
        status: ValidationStatus.VALIDATED,
        requestedDate: {
          gte: start,
          lt: end,
        },
      },
    });

    return advances.map((s) => new SalaryAdvanceEntity(s));
  }
}
