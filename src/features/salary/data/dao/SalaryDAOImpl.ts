/* eslint-disable no-unused-vars */
import {
  PrismaClient,
  SalaryPaymentMode,
  ValidationStatus,
} from '@prisma/client';
import { SalaryDAO } from './SalaryDAO';
import { SalaryEntity } from '../entity/SalaryEntity';

export class SalaryDAOImpl implements SalaryDAO {
  constructor(private readonly prisma: PrismaClient) {}

  private toEntity(record: any): SalaryEntity {
    return new SalaryEntity({
      id: record.id,
      employeeId: record.employeeId,
      grossSalary: record.grossSalary,
      deductions: record.deductions,
      advances: record.advances,
      netSalary: record.netSalary,
      paymentMode: record.paymentMode,
      paymentDate: new Date(record.paymentDate),
      payslipUrl: record.payslipUrl,
      year: record.year,
      month: record.month,
      status: record.status,
      validatedByAdmin: record.validateByAdmin,
      validatedBySuperAdmin: record.validateBySuperAdmin,
      rejectedReason: record.rejectedReason,
      creatorId: record.creatorId,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  async create(data: Partial<SalaryEntity>): Promise<SalaryEntity> {
    const rawDate = new Date(data.paymentDate!);

    if (isNaN(rawDate.getTime())) {
      throw new Error(`Invalid paymentDate: ${data.paymentDate}`);
    }

    const year = rawDate.getFullYear().toString();
    const month = (rawDate.getMonth() + 1).toString().padStart(2, '0');

    const created = await this.prisma.salary.create({
      data: {
        employeeId: data.employeeId!,
        grossSalary: data.grossSalary!,
        deductions: data.deductions!,
        advances: data.advances!,
        netSalary: data.netSalary!,
        paymentMode: data.paymentMode as SalaryPaymentMode,
        paymentDate: rawDate,
        payslipUrl: data.payslipUrl ?? null,
        year,
        month,
        status: data.status,
        creatorId: data.creatorId,
      },
    });

    return this.toEntity(created);
  }

  async findById(id: string): Promise<SalaryEntity | null> {
    const result = await this.prisma.salary.findUnique({ where: { id } });
    return result ? this.toEntity(result) : null;
  }

  async findAll(): Promise<SalaryEntity[]> {
    const results = await this.prisma.salary.findMany({
      orderBy: { paymentDate: 'desc' },
    });
    return results.map(this.toEntity);
  }

  async findByEmployee(employeeId: string): Promise<SalaryEntity[]> {
    const results = await this.prisma.salary.findMany({
      where: { employeeId },
      orderBy: { paymentDate: 'desc' },
    });
    return results.map(this.toEntity);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.salary.delete({ where: { id } });
  }

  async update(id: string, data: Partial<SalaryEntity>): Promise<SalaryEntity> {
    const updated = await this.prisma.salary.update({
      where: { id },
      data: {
        grossSalary: data.grossSalary,
        deductions: data.deductions,
        advances: data.advances,
        netSalary: data.netSalary,
        paymentMode: data.paymentMode as SalaryPaymentMode,
        paymentDate: data.paymentDate,
        payslipUrl: data.payslipUrl ?? null,
      },
    });
    return this.toEntity(updated);
  }

  async findAndCount(
    offset: number,
    limit: number
  ): Promise<[SalaryEntity[], number]> {
    const [items, total] = await this.prisma.$transaction([
      this.prisma.salary.findMany({
        skip: offset,
        take: limit,
        orderBy: { paymentDate: 'desc' },
      }),
      this.prisma.salary.count(),
    ]);
    return [items.map(this.toEntity), total];
  }

  async findByPeriod(month: number, year: number): Promise<SalaryEntity[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999); // dernier jour du mois

    const results = await this.prisma.salary.findMany({
      where: {
        paymentDate: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { paymentDate: 'asc' },
    });

    return results.map(this.toEntity);
  }

  async findByPeriodPaginated(
    month: number,
    year: number,
    offset: number,
    limit: number
  ): Promise<[SalaryEntity[], number]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.salary.findMany({
        where: {
          paymentDate: { gte: start, lte: end },
        },
        orderBy: { paymentDate: 'asc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.salary.count({
        where: {
          paymentDate: { gte: start, lte: end },
        },
      }),
    ]);

    return [items.map(this.toEntity), total];
  }

  async validateByAdmin(salaryId: string, validatorId: string): Promise<void> {
    await this.prisma.salary.update({
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
    await this.prisma.salary.update({
      where: { id: salaryId },
      data: {
        validatedBySuperAdmin: validatorId,
        status: ValidationStatus.VALIDATED,
      },
    });
  }

  async reject(salaryId: string, reason: string): Promise<void> {
    await this.prisma.salary.update({
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
  ): Promise<SalaryEntity> {
    const updated = await this.prisma.salary.update({
      where: { id },
      data: { status },
    });

    return new SalaryEntity(updated);
  }
}
