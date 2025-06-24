import {
  PrismaClient,
  ExpenseCategory,
  ExpenseCategoryGroup,
  Prisma,
} from '@prisma/client';
import { ExpenseDAO } from './ExpenseDAO';
import { ExpenseEntity } from '../entity/ExpenseEntity';
import { ExpenseStatsDTO } from '@features/expense/presentation/dto/ExpenseStatsDTO';

const prisma = new PrismaClient();

export class ExpenseDAOImpl implements ExpenseDAO {
  private toEntity(record: any): ExpenseEntity {
    return new ExpenseEntity({
      id: record.id,
      amount: record.amount,
      date: new Date(record.date),
      category: record.category,
      group: record.group,
      description: record.description,
      fileUrl: record.fileUrl,
      employeeId: record.employeeId,
      projectId: record.projectId,
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.updatedAt),
    });
  }

  async create(data: Partial<ExpenseEntity>): Promise<ExpenseEntity> {
    const created = await prisma.expense.create({
      data: {
        amount: data.amount!,
        date: data.date!,
        category: data.category as ExpenseCategory,
        group: data.group as ExpenseCategoryGroup,
        description: data.description ?? null,
        fileUrl: data.fileUrl ?? null,
        employeeId: data.employeeId!,
        projectId: data.projectId ?? null,
      },
    });
    return this.toEntity(created);
  }

  async findById(id: string): Promise<ExpenseEntity | null> {
    const found = await prisma.expense.findUnique({ where: { id } });
    return found ? this.toEntity(found) : null;
  }

  async findAll(): Promise<ExpenseEntity[]> {
    const results = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
    });
    return results.map(this.toEntity);
  }

  async delete(id: string): Promise<void> {
    await prisma.expense.delete({ where: { id } });
  }

  async update(
    id: string,
    updates: Partial<ExpenseEntity>
  ): Promise<ExpenseEntity> {
    const updated = await prisma.expense.update({
      where: { id },
      data: {
        amount: updates.amount,
        date: updates.date,
        category: updates.category as ExpenseCategory,
        group: updates.group as ExpenseCategoryGroup,
        description: updates.description ?? null,
        fileUrl: updates.fileUrl ?? null,
        employeeId: updates.employeeId,
        projectId: updates.projectId ?? null,
        updatedAt: new Date(),
      },
    });
    return this.toEntity(updated);
  }

  async filterByCriteria(filters: {
    category?: ExpenseCategory;
    startDate?: Date;
    endDate?: Date;
  }): Promise<ExpenseEntity[]> {
    const results = await prisma.expense.findMany({
      where: {
        category: filters.category,
        date: {
          gte: filters.startDate,
          lte: filters.endDate,
        },
      },
      orderBy: { date: 'desc' },
    });
    return results.map(this.toEntity);
  }

  async findAndCount(
    offset: number,
    limit: number
  ): Promise<[ExpenseEntity[], number]> {
    const [items, total] = await prisma.$transaction([
      prisma.expense.findMany({
        skip: offset,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.expense.count(),
    ]);
    return [items.map(this.toEntity), total];
  }

  async filterExpenses(filters: {
    startDate?: Date;
    endDate?: Date;
    category?: ExpenseCategory; // ✅ corrigé ici
    employeeId?: string;
    projectId?: string;
  }): Promise<ExpenseEntity[]> {
    const whereClause: Prisma.ExpenseWhereInput = {
      AND: [
        filters.startDate ? { date: { gte: filters.startDate } } : undefined,
        filters.endDate ? { date: { lte: filters.endDate } } : undefined,
        filters.category ? { category: filters.category } : undefined,
        filters.employeeId ? { employeeId: filters.employeeId } : undefined,
        filters.projectId ? { projectId: filters.projectId } : undefined,
      ].filter(Boolean) as Prisma.ExpenseWhereInput[],
    };

    const results = await prisma.expense.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });

    return results.map(this.toEntity);
  }

  async getStatistics(year: number): Promise<ExpenseStatsDTO> {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31T23:59:59.999Z`);

    const expenses = await prisma.expense.findMany({
      where: {
        date: { gte: start, lte: end },
      },
    });

    let totalYear = 0;
    const monthlyTotals: Record<string, number> = {};
    const byCategory: Record<string, number> = {};

    for (const expense of expenses) {
      const date = new Date(expense.date);
      const month = `${date.getMonth() + 1}`.padStart(2, '0');
      const amount = expense.amount;

      totalYear += amount;
      monthlyTotals[month] = (monthlyTotals[month] || 0) + amount;
      byCategory[expense.category] =
        (byCategory[expense.category] || 0) + amount;
    }

    return { totalYear, monthlyTotals, byCategory };
  }
}
