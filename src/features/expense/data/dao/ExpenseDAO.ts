/* eslint-disable no-unused-vars */
import { ExpenseCategory } from '@prisma/client';
import { ExpenseEntity } from '../entity/ExpenseEntity';
import { ExpenseStatsDTO } from '@features/expense/presentation/dto/ExpenseStatsDTO';

export interface ExpenseDAO {
  create(expense: Partial<ExpenseEntity>): Promise<ExpenseEntity>;
  findById(id: string): Promise<ExpenseEntity | null>;
  findAll(): Promise<ExpenseEntity[]>;
  delete(id: string): Promise<void>;
  update(id: string, updates: Partial<ExpenseEntity>): Promise<ExpenseEntity>;
  filterByCriteria(filters: {
    category?: ExpenseCategory;
    startDate?: Date;
    endDate?: Date;
  }): Promise<ExpenseEntity[]>;
  findAndCount(
    offset: number,
    limit: number
  ): Promise<[ExpenseEntity[], number]>;
  filterExpenses(filters: {
    startDate?: Date;
    endDate?: Date;
    category?: string;
    employeeId?: string;
    projectId?: string;
  }): Promise<ExpenseEntity[]>;
  getStatistics(year: number): Promise<ExpenseStatsDTO>;
}
