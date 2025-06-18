/* eslint-disable no-unused-vars */
import { PrismaClient, SalaryAdvanceStatus } from '@prisma/client';
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
        status: data.status ?? SalaryAdvanceStatus.PENDING,
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

  async updateStatus(id: string, status: SalaryAdvanceStatus): Promise<void> {
    await this.prisma.salaryAdvance.update({
      where: { id },
      data: { status },
    });
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
        status: 'APPROVED',
        requestedDate: {
          gte: start,
          lt: end,
        },
      },
    });

    return results.reduce((sum, adv) => sum + adv.amount, 0);
  }
}
