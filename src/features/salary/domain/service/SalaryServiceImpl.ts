/* eslint-disable no-unused-vars */
import { SalaryDAO } from '@features/salary/data/dao/SalaryDAO';
import { SalaryService } from './SalaryService';
import { CreateSalaryRequest } from '@features/salary/presentation/payload/CreateSalaryRequest';
import { UpdateSalaryRequest } from '@features/salary/presentation/payload/UpdateSalaryRequest';
import { SalaryDTO } from '@features/salary/presentation/dto/SalaryDTO';
import { SalaryPaginationDTO } from '@features/salary/presentation/dto/SalaryPaginationDTO';
import { SalaryListRequest } from '@features/salary/presentation/payload/SalaryListRequest';
import { toSalaryDTO } from '@features/salary/presentation/mapper/SalaryMapper';
import { v4 as uuidv4 } from 'uuid';
import { SalaryEntity } from '@features/salary/data/entity/SalaryEntity';
import { ResourceNotFoundException } from '@core/exceptions/ResourceNotFoundException';
import { SalaryPdfDataDTO } from '@features/salary/presentation/dto/SalaryPdfDataDTO';
import { toSalaryPdfDataDTO } from '@features/salary/presentation/mapper/SalaryMapper';
import { SalaryPeriodDTO } from '@features/salary/presentation/dto/SalaryPeriodDTO';
import { SalaryPeriodPaginationDTO } from '@features/salary/presentation/dto/SalaryPeriodPaginationDTO';
import { UserDAO } from '@features/auth/data/dao/UserDAO';
import { NotificationService } from '@features/notification/domain/service/NotificationService';
import { RoleEnum, ValidationStatus } from '@prisma/client';
import { config } from '@core/config/env';
import { ValidationException } from '@core/exceptions/ValidationException';
import { logger } from '@core/config/logger';
import { SalaryAdvanceDAO } from '@features/salary/data/dao/SalaryAdvanceDAO';

export class SalaryServiceImpl implements SalaryService {
  constructor(
    private readonly salaryDAO: SalaryDAO,
    private readonly salaryAdvanceDAO: SalaryAdvanceDAO,
    private readonly userDAO: UserDAO,
    private readonly notificationService: NotificationService
  ) {}

  async createSalary(request: CreateSalaryRequest): Promise<SalaryDTO> {
    const user = await this.userDAO.findById(request.userId);
    if (!user) throw new ResourceNotFoundException('Utilisateur non trouvée');

    const { employeeId, grossSalary, deductions, paymentMode, paymentDate } =
      request;

    const date = new Date(paymentDate);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const advanceTotal =
      await this.salaryAdvanceDAO.findApprovedByEmployeeAndMonth(
        employeeId,
        year,
        month
      );

    const totalAdvances = advanceTotal.reduce(
      (sum, adv) => sum + (adv.amount ?? 0),
      0
    );

    const netSalary = grossSalary - deductions - totalAdvances;

    const entity = new SalaryEntity({
      id: uuidv4(),
      employeeId,
      grossSalary,
      deductions,
      advances: totalAdvances,
      netSalary,
      paymentMode,
      paymentDate,
      payslipUrl: null,
      year,
      month,
      status: user.roles.includes(RoleEnum.SUPER_ADMIN)
        ? ValidationStatus.VALIDATED
        : user.roles.includes(RoleEnum.ADMIN)
          ? ValidationStatus.AWAITING_SUPERADMIN_VALIDATION
          : ValidationStatus.AWAITING_ADMIN_VALIDATION,
      creatorId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.salaryDAO.create(entity);

    const admins = await this.userDAO.findAllByRoles(['ADMIN', 'SUPER_ADMIN']);

    await this.notificationService.notifyMany(
      admins.map((a) => a.id),
      'SALARY_CREATED',
      'Nouveau salaire créé',
      `Identifiant : ${saved.id}`,
      `${config.server.frontend}/salaries/${saved.id}/view`
    );

    return toSalaryDTO(saved);
  }

  async updateSalary(
    id: string,
    request: UpdateSalaryRequest
  ): Promise<SalaryDTO> {
    const existing = await this.salaryDAO.findById(id);
    if (!existing) {
      throw new ResourceNotFoundException('Fiche de salaire non trouvée');
    }

    const updatedNetSalary =
      (request.grossSalary ?? existing.grossSalary) -
      (request.deductions ?? existing.deductions) -
      (request.advances ?? existing.advances);

    const updated = await this.salaryDAO.update(id, {
      ...request,
      netSalary: updatedNetSalary,
    });

    return toSalaryDTO(updated);
  }

  async getSalaryById(id: string): Promise<SalaryDTO | null> {
    const result = await this.salaryDAO.findById(id);
    return result ? toSalaryDTO(result) : null;
  }

  async getPaginatedSalaries(
    query: SalaryListRequest
  ): Promise<SalaryPaginationDTO> {
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    const [items, totalItems] = await this.salaryDAO.findAndCount(
      offset,
      limit
    );
    return {
      items: items.map(toSalaryDTO),
      currentPage: page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      pageSize: items.length,
      pageLimit: limit,
    };
  }

  async getSalariesByEmployee(employeeName: string): Promise<SalaryDTO[]> {
    const results = await this.salaryDAO.findByEmployee(employeeName);
    return results.map(toSalaryDTO);
  }

  async deleteSalary(id: string): Promise<void> {
    await this.salaryDAO.delete(id);
  }

  async getSalaryPdfData(id: string): Promise<SalaryPdfDataDTO> {
    const salary = await this.salaryDAO.findById(id);
    if (!salary) throw new Error('Fiche de salaire non trouvée');
    return toSalaryPdfDataDTO(salary);
  }

  async getSalariesByPeriod(
    month: number,
    year: number
  ): Promise<SalaryPeriodDTO[]> {
    const results = await this.salaryDAO.findByPeriod(month, year);
    return results.map((s) => ({
      employeeId: s.employeeId,
      grossSalary: s.grossSalary,
      deductions: s.deductions,
      advances: s.advances,
      netSalary: s.netSalary,
      paymentDate: s.paymentDate.toISOString().split('T')[0],
    }));
  }

  async getSalariesByPeriodPaginated(
    month: number,
    year: number,
    page: number,
    limit: number
  ): Promise<SalaryPeriodPaginationDTO> {
    const offset = (page - 1) * limit;
    const [items, totalItems] = await this.salaryDAO.findByPeriodPaginated(
      month,
      year,
      offset,
      limit
    );
    return {
      items: items.map((s) => ({
        employeeId: s.employeeId,
        grossSalary: s.grossSalary,
        deductions: s.deductions,
        advances: s.advances,
        netSalary: s.netSalary,
        paymentDate: s.paymentDate.toISOString().split('T')[0],
      })),
      currentPage: page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      pageSize: items.length,
      pageLimit: limit,
    };
  }

  async validateAsAdmin(id: string, validatorId: string): Promise<void> {
    const salary = await this.salaryDAO.findById(id);
    if (
      !salary ||
      salary.status !== ValidationStatus.AWAITING_ADMIN_VALIDATION
    ) {
      throw new ValidationException(
        'Statut incompatible pour validation admin'
      );
    }

    await this.salaryDAO.validateByAdmin(id, validatorId);

    const superAdmins = await this.userDAO.findAllByRoles(['SUPER_ADMIN']);
    await this.notificationService.notifyMany(
      superAdmins.map((a) => a.id),
      'SALARY_TO_FINAL_VALIDATE',
      'Validation finale requise',
      `Salaire ${salary.id} à valider définitivement`,
      `${config.server.frontend}/salaries/${salary.id}/view`
    );
  }

  async validateAsSuperAdmin(id: string, validatorId: string): Promise<void> {
    const salary = await this.salaryDAO.findById(id);
    if (
      !salary ||
      salary.status !== ValidationStatus.AWAITING_SUPERADMIN_VALIDATION
    ) {
      throw new ValidationException(
        'Statut incompatible pour validation super admin'
      );
    }

    await this.salaryDAO.validateBySuperAdmin(id, validatorId);

    await this.notificationService.notify(
      salary.creatorId!,
      'SALARY_VALIDATED',
      'Votre salaire a été validé',
      `Identifiant : ${salary.id}`,
      `${config.server.frontend}/salaries/${salary.id}/view`
    );
  }

  async reject(id: string, reason: string): Promise<void> {
    const salary = await this.salaryDAO.findById(id);
    if (!salary || salary.status === ValidationStatus.VALIDATED) {
      throw new ValidationException('Impossible de rejeter ce salaire');
    }

    if (!reason) {
      throw new ValidationException('Le motif du rejet est obligatoire');
    }

    await this.salaryDAO.reject(id, reason);

    await this.notificationService.notify(
      salary.creatorId!,
      'SALARY_REJECTED',
      'Votre salaire a été rejeté',
      `Identifiant : ${salary.id} — Raison : ${reason}`,
      `${config.server.frontend}/salaries/${salary.id}/view`
    );
  }

  async updateStatus(id: string, status: ValidationStatus): Promise<SalaryDTO> {
    const salary = await this.salaryDAO.findById(id);
    if (!salary) throw new ResourceNotFoundException('Dépense non trouvée');

    const updatedEntity = await this.salaryDAO.updateStatus(id, status);

    const creator = await this.userDAO.findById(salary.creatorId!);

    if (!creator) {
      logger.warn(`Aucun utilisateur trouvé pour la dépense ${id}`);
      return toSalaryDTO(updatedEntity);
    }

    const salaryId = salary.id;

    if (status === ValidationStatus.AWAITING_ADMIN_VALIDATION) {
      const admins = await this.userDAO.findAllByRoles(['ADMIN']);
      await this.notificationService.notifyMany(
        admins.map((a) => a.id),
        'SALARY_TO_VALIDATE',
        'Validation salaire',
        `Salaire ${salaryId} à valider`,
        `${config.server.frontend}/salaries/${salary.id}/view`
      );
    } else if (status === ValidationStatus.AWAITING_SUPERADMIN_VALIDATION) {
      const superAdmins = await this.userDAO.findAllByRoles(['SUPER_ADMIN']);
      await this.notificationService.notifyMany(
        superAdmins.map((a) => a.id),
        'SALARY_TO_FINAL_VALIDATE',
        'Validation finale salaire requise',
        `Salaire ${salaryId} à valider définitivement`,
        `${config.server.frontend}/salaries/${salary.id}/view`
      );
    }

    return toSalaryDTO(updatedEntity);
  }
}
