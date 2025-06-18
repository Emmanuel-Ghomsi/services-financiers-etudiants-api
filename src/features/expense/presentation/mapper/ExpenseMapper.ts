import { ExpenseEntity } from '@features/expense/data/entity/ExpenseEntity';
import { ExpenseDTO } from '../dto/ExpenseDTO';
import { ExpenseCategory } from '@core/config/enums/ExpenseCategory';
import { ExpenseCategoryGroup } from '@core/config/enums/ExpenseCategoryGroup';

export function toExpenseDTO(expense: ExpenseEntity): ExpenseDTO {
  return {
    id: expense.id,
    amount: expense.amount,
    date: expense.date.toISOString().split('T')[0], // YYYY-MM-DD
    category: expense.category,
    group: expense.group,
    description: expense.description ?? undefined,
    fileUrl: expense.fileUrl ?? undefined,
    employeeId: expense.employeeId,
    projectId: expense.projectId,
    createdAt: expense.createdAt.toISOString(),
    updatedAt: expense.updatedAt.toISOString(),
  };
}

export function fromExpenseDTO(dto: ExpenseDTO): ExpenseEntity {
  return {
    id: dto.id,
    amount: dto.amount,
    date: new Date(dto.date),
    category: dto.category as ExpenseCategory, // cast explicite
    group: dto.group as ExpenseCategoryGroup, // cast explicite
    description: dto.description ?? null,
    fileUrl: dto.fileUrl ?? null,
    employeeId: dto.employeeId,
    projectId: dto.projectId ?? null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

export function toExpenseEntity(record: any): ExpenseEntity {
  return {
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
  };
}
