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
import {
  ExpenseCategory,
  ExpenseCategoryGroup,
  RoleEnum,
  ValidationStatus,
} from '@prisma/client';
import { ExpenseFilterRequest } from '@features/expense/presentation/payload/ExpenseFilterRequest';
import { ExpenseStatsDTO } from '@features/expense/presentation/dto/ExpenseStatsDTO';
import { UserDAO } from '@features/auth/data/dao/UserDAO';
import { ValidationException } from '@core/exceptions/ValidationException';
import { NotificationService } from '@features/notification/domain/service/NotificationService';
import { config } from '@core/config/env';
import { logger } from '@core/config/logger';

export class ExpenseServiceImpl implements ExpenseService {
  constructor(
    private readonly expenseDAO: ExpenseDAO,
    private readonly userDAO: UserDAO,
    private readonly notificationService: NotificationService
  ) {}

  async createExpense(request: CreateExpenseRequest): Promise<ExpenseDTO> {
    const user = await this.userDAO.findById(request.userId);
    if (!user) throw new ResourceNotFoundException('Utilisateur non trouvée');

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
      status: user.roles.includes(RoleEnum.SUPER_ADMIN)
        ? ValidationStatus.VALIDATED
        : user.roles.includes(RoleEnum.ADMIN)
          ? ValidationStatus.AWAITING_SUPERADMIN_VALIDATION
          : ValidationStatus.AWAITING_ADMIN_VALIDATION,
      creatorId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.expenseDAO.create(entity);

    const admins = await this.userDAO.findAllByRoles(['ADMIN', 'SUPER_ADMIN']);

    await this.notificationService.notifyMany(
      admins.map((a) => a.id),
      'EXPENSE_CREATED',
      'Nouvelle dépense créée',
      `Identifiant : ${saved.id}`,
      `${config.server.frontend}/expenses/${saved.id}/view`
    );

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

  async validateAsAdmin(id: string, validatorId: string): Promise<void> {
    const expense = await this.expenseDAO.findById(id);
    if (
      !expense ||
      expense.status !== ValidationStatus.AWAITING_ADMIN_VALIDATION
    ) {
      throw new ValidationException(
        'Statut incompatible pour validation admin'
      );
    }

    await this.expenseDAO.validateByAdmin(id, validatorId);

    const superAdmins = await this.userDAO.findAllByRoles(['SUPER_ADMIN']);
    await this.notificationService.notifyMany(
      superAdmins.map((a) => a.id),
      'EXPENSE_TO_FINAL_VALIDATE',
      'Validation finale requise',
      `Dépense ${expense.id} à valider définitivement`,
      `${config.server.frontend}/expenses/${expense.id}/view`
    );
  }

  async validateAsSuperAdmin(id: string, validatorId: string): Promise<void> {
    const expense = await this.expenseDAO.findById(id);
    if (
      !expense ||
      expense.status !== ValidationStatus.AWAITING_SUPERADMIN_VALIDATION
    ) {
      throw new ValidationException(
        'Statut incompatible pour validation super admin'
      );
    }

    await this.expenseDAO.validateBySuperAdmin(id, validatorId);

    await this.notificationService.notify(
      expense.creatorId!,
      'EXPENSE_VALIDATED',
      'Votre fiche a été validée',
      `Identifiant : ${expense.id}`,
      `${config.server.frontend}/expenses/${expense.id}/view`
    );
  }

  async reject(id: string, reason: string): Promise<void> {
    const expense = await this.expenseDAO.findById(id);
    if (!expense || expense.status === ValidationStatus.VALIDATED) {
      throw new ValidationException('Impossible de rejeter cette dépense');
    }

    if (!reason) {
      throw new ValidationException('Le motif du rejet est obligatoire');
    }

    await this.expenseDAO.reject(id, reason);

    await this.notificationService.notify(
      expense.creatorId!,
      'EXPENSE_REJECTED',
      'Votre dépense a été rejetée',
      `Identifiant : ${expense.id} — Raison : ${reason}`,
      `${config.server.frontend}/expenses/${expense.id}/view`
    );
  }

  async updateStatus(
    id: string,
    status: ValidationStatus
  ): Promise<ExpenseDTO> {
    const expense = await this.expenseDAO.findById(id);
    if (!expense) throw new ResourceNotFoundException('Dépense non trouvée');

    const updatedEntity = await this.expenseDAO.updateStatus(id, status);

    const creator = await this.userDAO.findById(expense.creatorId!);

    if (!creator) {
      logger.warn(`Aucun utilisateur trouvé pour la dépense ${id}`);
      return toExpenseDTO(updatedEntity);
    }

    const expenseId = expense.id;

    if (status === ValidationStatus.AWAITING_ADMIN_VALIDATION) {
      const admins = await this.userDAO.findAllByRoles(['ADMIN']);
      await this.notificationService.notifyMany(
        admins.map((a) => a.id),
        'EXPENSE_TO_VALIDATE',
        'Validation dépense',
        `Dépense ${expenseId} à valider`,
        `${config.server.frontend}/expenses/${expense.id}/view`
      );
    } else if (status === ValidationStatus.AWAITING_SUPERADMIN_VALIDATION) {
      const superAdmins = await this.userDAO.findAllByRoles(['SUPER_ADMIN']);
      await this.notificationService.notifyMany(
        superAdmins.map((a) => a.id),
        'EXPENSE_TO_FINAL_VALIDATE',
        'Validation finale dépense requise',
        `Dépense ${expenseId} à valider définitivement`,
        `${config.server.frontend}/expenses/${expense.id}/view`
      );
    }

    return toExpenseDTO(updatedEntity);
  }
}
