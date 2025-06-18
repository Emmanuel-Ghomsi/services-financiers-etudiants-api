/* eslint-disable no-unused-vars */
import { ExpenseDTO } from '@features/expense/presentation/dto/ExpenseDTO';
import { ExpensePaginationDTO } from '@features/expense/presentation/dto/ExpensePaginationDTO';
import { ExpenseStatsDTO } from '@features/expense/presentation/dto/ExpenseStatsDTO';
import { CreateExpenseRequest } from '@features/expense/presentation/payload/CreateExpenseRequest';
import { ExpenseFilterRequest } from '@features/expense/presentation/payload/ExpenseFilterRequest';
import { ExpenseListRequest } from '@features/expense/presentation/payload/ExpenseListRequest';
import { UpdateExpenseRequest } from '@features/expense/presentation/payload/UpdateExpenseRequest';

export interface ExpenseService {
  createExpense(request: CreateExpenseRequest): Promise<ExpenseDTO>;
  updateExpense(id: string, request: UpdateExpenseRequest): Promise<ExpenseDTO>;
  getAllExpenses(): Promise<ExpenseDTO[]>;
  getPaginatedExpenses(
    query: ExpenseListRequest
  ): Promise<ExpensePaginationDTO>;
  getExpenseById(id: string): Promise<ExpenseDTO | null>;
  deleteExpense(id: string): Promise<void>;
  filterExpenses(filters: ExpenseFilterRequest): Promise<ExpenseDTO[]>;
  getStatistics(year: number): Promise<ExpenseStatsDTO>;
  updateFileUrl(id: string, fileUrl: string): Promise<void>;
}
