/* eslint-disable no-unused-vars */
import { PrismaClient, ValidationStatus } from '@prisma/client';
import { DashboardDAO } from './DashboardDAO';

export class DashboardDAOImpl implements DashboardDAO {
  constructor(private readonly prisma: PrismaClient) {}

  async getTotalSalariesThisMonth(): Promise<number> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const result = await this.prisma.salary.aggregate({
      where: {
        paymentDate: { gte: start, lt: end },
      },
      _sum: {
        netSalary: true,
      },
    });

    return result._sum.netSalary ?? 0;
  }

  async getPendingAdvancesCount(): Promise<number> {
    return this.prisma.salaryAdvance.count({
      where: {
        status:
          ValidationStatus.AWAITING_ADMIN_VALIDATION ||
          ValidationStatus.AWAITING_SUPERADMIN_VALIDATION,
      },
    });
  }

  async getMonthlyExpensesTotal(): Promise<number> {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const expenses = await this.prisma.expense.findMany({
      where: { date: { gte: start, lt: end } },
    });

    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  async getActiveLeavesCount(): Promise<number> {
    const today = new Date();
    return this.prisma.leave.count({
      where: {
        startDate: { lte: today },
        endDate: { gte: today },
        status: ValidationStatus.VALIDATED,
      },
    });
  }

  async getMonthlySalaryEvolution(
    year: number
  ): Promise<{ month: number; total: number }[]> {
    const salaries = await this.prisma.salary.findMany({
      where: {
        paymentDate: {
          gte: new Date(`${year}-01-01`),
          lt: new Date(`${year + 1}-01-01`),
        },
      },
      select: {
        paymentDate: true,
        netSalary: true,
      },
    });

    const grouped = new Map<number, number>();

    for (const s of salaries) {
      const month = s.paymentDate.getMonth() + 1;
      grouped.set(month, (grouped.get(month) ?? 0) + s.netSalary);
    }

    return Array.from(grouped.entries()).map(([month, total]) => ({
      month,
      total,
    }));
  }

  async getExpenseDistribution(
    year: number,
    month?: number
  ): Promise<{ category: string; total: number }[]> {
    const start = new Date(`${year}-${month ?? 1}-01`);
    const end = month
      ? new Date(year, month, 0, 23, 59, 59)
      : new Date(`${year + 1}-01-01`);

    const expenses = await this.prisma.expense.groupBy({
      by: ['category'],
      where: {
        date: {
          gte: start,
          lt: end,
        },
      },
      _sum: {
        amount: true,
      },
    });

    return expenses.map((e) => ({
      category: e.category,
      total: e._sum.amount ?? 0,
    }));
  }
}
