/* eslint-disable no-unused-vars */
import { SalaryAdvanceService } from './SalaryAdvanceService';
import { SalaryAdvanceDAO } from '@features/salary/data/dao/SalaryAdvanceDAO';
import { CreateSalaryAdvanceRequest } from '@features/salary/presentation/payload/CreateSalaryAdvanceRequest';
import { SalaryAdvanceDTO } from '@features/salary/presentation/dto/SalaryAdvanceDTO';
import { toSalaryAdvanceDTO } from '@features/salary/presentation/mapper/SalaryAdvanceMapper';
import { SalaryAdvanceEntity } from '@features/salary/data/entity/SalaryAdvanceEntity';
import { UserDAO } from '@features/auth/data/dao/UserDAO';
import { NotificationService } from '@features/notification/domain/service/NotificationService';
import { ResourceNotFoundException } from '@core/exceptions/ResourceNotFoundException';
import { RoleEnum, ValidationStatus } from '@prisma/client';
import { ValidationException } from '@core/exceptions/ValidationException';
import { config } from '@core/config/env';
import { logger } from '@core/config/logger';

export class SalaryAdvanceServiceImpl implements SalaryAdvanceService {
  constructor(
    private readonly dao: SalaryAdvanceDAO,
    private readonly userDAO: UserDAO,
    private readonly notificationService: NotificationService
  ) {}

  async requestAdvance(
    data: CreateSalaryAdvanceRequest
  ): Promise<SalaryAdvanceDTO> {
    const user = await this.userDAO.findById(data.userId);
    if (!user) throw new ResourceNotFoundException('Utilisateur non trouvée');

    const created = await this.dao.create({
      amount: data.amount,
      reason: data.reason,
      requestedDate: data.requestedDate,
      employeeId: data.employeeId,
      creatorId: data.userId,
      status: user.roles.includes(RoleEnum.SUPER_ADMIN)
        ? ValidationStatus.VALIDATED
        : user.roles.includes(RoleEnum.ADMIN)
          ? ValidationStatus.AWAITING_SUPERADMIN_VALIDATION
          : ValidationStatus.AWAITING_ADMIN_VALIDATION,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return toSalaryAdvanceDTO(created);
  }

  async getEmployeeHistory(employeeId: string): Promise<SalaryAdvanceDTO[]> {
    const history = await this.dao.findAllByEmployee(employeeId);
    return history.map(toSalaryAdvanceDTO);
  }

  async getApprovedAdvanceTotal(
    employeeId: string,
    year: string,
    month: string
  ): Promise<number> {
    return this.dao.getApprovedAdvancesByEmployeeAndMonth(
      employeeId,
      year,
      month
    );
  }

  async findAll(): Promise<SalaryAdvanceDTO[]> {
    const list = await this.dao.findAll();
    return list.map(toSalaryAdvanceDTO);
  }

  async update(
    id: string,
    data: Partial<SalaryAdvanceDTO>
  ): Promise<SalaryAdvanceDTO> {
    const entityCompatible: Partial<SalaryAdvanceEntity> = {
      ...data,
      requestedDate: data.requestedDate
        ? new Date(data.requestedDate)
        : undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      status: data.status as ValidationStatus,
    };

    const updated = await this.dao.update(id, entityCompatible);
    return toSalaryAdvanceDTO(updated);
  }

  async delete(id: string): Promise<void> {
    await this.dao.delete(id);
  }

  async validateAsAdmin(id: string, validatorId: string): Promise<void> {
    const salaryAdvance = await this.dao.findById(id);
    if (
      !salaryAdvance ||
      salaryAdvance.status !== ValidationStatus.AWAITING_ADMIN_VALIDATION
    ) {
      throw new ValidationException(
        'Statut incompatible pour validation admin'
      );
    }

    await this.dao.validateByAdmin(id, validatorId);

    const superAdmins = await this.userDAO.findAllByRoles(['SUPER_ADMIN']);
    await this.notificationService.notifyMany(
      superAdmins.map((a) => a.id),
      'SALARY_ADVANCE_TO_FINAL_VALIDATE',
      'Validation finale requise',
      `Avance de salaire ${salaryAdvance.id} à valider définitivement`,
      `${config.server.frontend}/salary-advances`
    );
  }

  async validateAsSuperAdmin(id: string, validatorId: string): Promise<void> {
    const salaryAdvance = await this.dao.findById(id);
    if (
      !salaryAdvance ||
      salaryAdvance.status !== ValidationStatus.AWAITING_SUPERADMIN_VALIDATION
    ) {
      throw new ValidationException(
        'Statut incompatible pour validation super admin'
      );
    }

    await this.dao.validateBySuperAdmin(id, validatorId);

    await this.notificationService.notify(
      salaryAdvance.creatorId!,
      'SALARY_ADVANCE_VALIDATED',
      'Votre avance de salaire a été validée',
      `Votre avance de salaire a été validée. Identifiant : ${salaryAdvance.id}`,
      `${config.server.frontend}/salary-advances`
    );
  }

  async reject(id: string, reason: string): Promise<void> {
    const salaryAdvance = await this.dao.findById(id);
    if (!salaryAdvance || salaryAdvance.status === ValidationStatus.VALIDATED) {
      throw new ValidationException(
        'Impossible de rejeter cette avance de salaire'
      );
    }

    if (!reason) {
      throw new ValidationException('Le motif du rejet est obligatoire');
    }

    await this.dao.reject(id, reason);

    await this.notificationService.notify(
      salaryAdvance.creatorId!,
      'SALARY_ADVANCE_REJECTED',
      'Votre avance de salaire a été rejetée',
      `Votre avance de salaire a été rejetée. Identifiant : ${salaryAdvance.id} — Raison : ${reason}`,
      `${config.server.frontend}/salary-advances/${salaryAdvance.id}/view`
    );
  }

  async updateStatus(
    id: string,
    status: ValidationStatus
  ): Promise<SalaryAdvanceDTO> {
    const salaryAdvance = await this.dao.findById(id);
    if (!salaryAdvance)
      throw new ResourceNotFoundException('Avance non trouvée');

    const updatedEntity = await this.dao.updateStatus(id, status);

    const creator = await this.userDAO.findById(salaryAdvance.creatorId!);

    if (!creator) {
      logger.warn(`Aucun utilisateur trouvé pour l'avance ${id}`);
      return toSalaryAdvanceDTO(updatedEntity);
    }

    const salaryAdvanceId = salaryAdvance.id;

    if (status === ValidationStatus.AWAITING_ADMIN_VALIDATION) {
      const admins = await this.userDAO.findAllByRoles(['ADMIN']);
      await this.notificationService.notifyMany(
        admins.map((a) => a.id),
        'SALARY_ADVANCE_TO_VALIDATE',
        'Validation avance de salaire',
        `Avance de salaire ${salaryAdvanceId} à valider`,
        `${config.server.frontend}/salary-advances/${salaryAdvance.id}/view`
      );
    } else if (status === ValidationStatus.AWAITING_SUPERADMIN_VALIDATION) {
      const superAdmins = await this.userDAO.findAllByRoles(['SUPER_ADMIN']);
      await this.notificationService.notifyMany(
        superAdmins.map((a) => a.id),
        'SALARY_ADVANCE_TO_FINAL_VALIDATE',
        'Validation finale dépense requise',
        `Avance de salaire ${salaryAdvanceId} à valider définitivement`,
        `${config.server.frontend}/salary-advances/${salaryAdvance.id}/view`
      );
    }

    return toSalaryAdvanceDTO(updatedEntity);
  }
}
