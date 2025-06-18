/* eslint-disable no-unused-vars */
import { ExpenseDAO } from '@features/expense/data/dao/ExpenseDAO';
import { ExpenseService } from './ExpenseService';
import { v4 as uuidv4 } from 'uuid';
import { CreateExpenseRequest } from '@features/expense/presentation/payload/CreateExpenseRequest';
import { ExpenseDTO } from '@features/expense/presentation/dto/ExpenseDTO';
import { ExpenseEntity } from '@features/expense/data/entity/ExpenseEntity';
import { toExpenseDTO } from '@features/expense/presentation/mapper/ExpenseMapper';
import { UpdateExpenseRequest } from '@features/expense/presentation/payload/UpdateExpenseRequest';
import { ResourceNotFoundException } from '@core/exceptions/ResourceNotFoundException';
import { ExpenseListRequest } from '@features/expense/presentation/payload/ExpenseListRequest';
import { ExpensePaginationDTO } from '@features/expense/presentation/dto/ExpensePaginationDTO';
import { ExpenseCategory, ExpenseCategoryGroup } from '@prisma/client';
import { ExpenseFilterRequest } from '@features/expense/presentation/payload/ExpenseFilterRequest';
import { ExpenseStatsDTO } from '@features/expense/presentation/dto/ExpenseStatsDTO';

export class ExpenseServiceImpl implements ExpenseService {
  constructor(private readonly expenseDAO: ExpenseDAO) {}

  async createExpense(request: CreateExpenseRequest): Promise<ExpenseDTO> {
    const entity = new ExpenseEntity({
      id: uuidv4(),
      amount: request.amount,
      date: request.date,
      category: request.category as ExpenseCategory,
      group: request.group as ExpenseCategoryGroup,
      description: request.description,
      fileUrl: request.fileUrl ?? null,
      employeeId: request.employeeId,
      projectId: request.projectId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.expenseDAO.create(entity);
    return toExpenseDTO(saved);
  }

  async updateExpense(
    id: string,
    request: UpdateExpenseRequest
  ): Promise<ExpenseDTO> {
    const existing = await this.expenseDAO.findById(id);
    if (!existing) {
      throw new ResourceNotFoundException('Dépense non trouvée');
    }

    const updatedEntity = new ExpenseEntity({
      ...existing,
      ...request,
      category: (request.category as ExpenseCategory) ?? existing.category,
      group: (request.group as ExpenseCategoryGroup) ?? existing.group,
      updatedAt: new Date(),
    });

    const saved = await this.expenseDAO.update(id, updatedEntity);
    return toExpenseDTO(saved);
  }

  async getAllExpenses(): Promise<ExpenseDTO[]> {
    const all = await this.expenseDAO.findAll();
    return all.map(toExpenseDTO);
  }

  async getExpenseById(id: string): Promise<ExpenseDTO | null> {
    const expense = await this.expenseDAO.findById(id);
    return expense ? toExpenseDTO(expense) : null;
  }

  async deleteExpense(id: string): Promise<void> {
    await this.expenseDAO.delete(id);
  }

  async getPaginatedExpenses(
    query: ExpenseListRequest
  ): Promise<ExpensePaginationDTO> {
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    const [items, totalItems] = await this.expenseDAO.findAndCount(
      offset,
      limit
    );
    return {
      items: items.map(toExpenseDTO),
      currentPage: page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      pageSize: items.length,
      pageLimit: limit,
    };
  }

  async filterExpenses(filters: ExpenseFilterRequest): Promise<ExpenseDTO[]> {
    const results = await this.expenseDAO.filterExpenses(filters);
    return results.map(toExpenseDTO);
  }

  async getStatistics(year: number): Promise<ExpenseStatsDTO> {
    return this.expenseDAO.getStatistics(year);
  }

  async updateFileUrl(id: string, fileUrl: string): Promise<void> {
    const expense = await this.expenseDAO.findById(id);
    if (!expense) throw new ResourceNotFoundException('Dépense non trouvée');
    expense.fileUrl = fileUrl;
    await this.expenseDAO.update(id, expense);
  }
}
