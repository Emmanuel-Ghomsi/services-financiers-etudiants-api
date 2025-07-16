/* eslint-disable no-unused-vars */
import { LeaveService } from './LeaveService';
import { LeaveDAO } from '@features/leave/data/dao/LeaveDAO';
import { CreateLeaveRequest } from '@features/leave/presentation/payload/CreateLeaveRequest';
import { UpdateLeaveRequest } from '@features/leave/presentation/payload/UpdateLeaveRequest';
import { LeaveDTO } from '@features/leave/presentation/dto/LeaveDTO';
import { LeaveListRequest } from '@features/leave/presentation/payload/LeaveListRequest';
import { LeavePaginationDTO } from '@features/leave/presentation/dto/LeavePaginationDTO';
import { toLeaveDTO } from '@features/leave/presentation/mapper/LeaveMapper';
import { LeaveEntity } from '@features/leave/data/entity/LeaveEntity';
import { v4 as uuidv4 } from 'uuid';
import { ResourceNotFoundException } from '@core/exceptions/ResourceNotFoundException';
import { LeaveStatsDTO } from '@features/leave/presentation/dto/LeaveStatsDTO';
import { LeaveBalanceDTO } from '@features/leave/presentation/dto/LeaveBalanceDTO';
import { UserDAO } from '@features/auth/data/dao/UserDAO';
import { NotificationService } from '@features/notification/domain/service/NotificationService';
import { RoleEnum, ValidationStatus } from '@prisma/client';
import { config } from '@core/config/env';
import { ValidationException } from '@core/exceptions/ValidationException';
import { logger } from '@core/config/logger';

export class LeaveServiceImpl implements LeaveService {
  constructor(
    private readonly leaveDAO: LeaveDAO,
    private readonly userDAO: UserDAO,
    private readonly notificationService: NotificationService
  ) {}

  async createLeave(request: CreateLeaveRequest): Promise<LeaveDTO> {
    const user = await this.userDAO.findById(request.userId);
    if (!user) throw new ResourceNotFoundException('Utilisateur non trouvée');

    const entity = new LeaveEntity({
      id: uuidv4(),
      employeeId: request.employeeId,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      comment: request.comment ?? null,
      status: user.roles.includes(RoleEnum.SUPER_ADMIN)
        ? ValidationStatus.VALIDATED
        : user.roles.includes(RoleEnum.ADMIN)
          ? ValidationStatus.AWAITING_SUPERADMIN_VALIDATION
          : ValidationStatus.AWAITING_ADMIN_VALIDATION,
      reviewedBy: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.leaveDAO.create(entity);

    const admins = await this.userDAO.findAllByRoles(['ADMIN', 'SUPER_ADMIN']);

    await this.notificationService.notifyMany(
      admins.map((a) => a.id),
      'LEAVE_CREATED',
      'Nouveau congé créé',
      `Nouveau congé créé, identifiant : ${saved.id}`,
      `${config.server.frontend}/leaves`
    );

    return toLeaveDTO(saved);
  }

  async updateLeave(
    id: string,
    request: UpdateLeaveRequest
  ): Promise<LeaveDTO> {
    const existing = await this.leaveDAO.findById(id);
    if (!existing) {
      throw new ResourceNotFoundException('Demande de congé non trouvée');
    }

    const updated = await this.leaveDAO.update(id, {
      ...request,
      updatedAt: new Date(),
    });

    return toLeaveDTO(updated);
  }

  async getLeaveById(id: string): Promise<LeaveDTO | null> {
    const result = await this.leaveDAO.findById(id);
    return result ? toLeaveDTO(result) : null;
  }

  async getLeavesByEmployee(employeeId: string): Promise<LeaveDTO[]> {
    const results = await this.leaveDAO.findByEmployee(employeeId);
    return results.map(toLeaveDTO);
  }

  async getPaginatedLeaves(
    query: LeaveListRequest
  ): Promise<LeavePaginationDTO> {
    const { page, limit, filters } = query;
    const offset = (page - 1) * limit;

    const [items, totalItems] = await this.leaveDAO.findAndCount(
      offset,
      limit,
      filters
    );

    return {
      items: items.map(toLeaveDTO),
      currentPage: page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      pageSize: items.length,
      pageLimit: limit,
    };
  }

  async deleteLeave(id: string): Promise<void> {
    await this.leaveDAO.delete(id);
  }

  async getLeaveBalance(
    employeeId: string,
    year: number
  ): Promise<LeaveBalanceDTO> {
    return await this.leaveDAO.getLeaveBalance(employeeId, year);
  }

  async getAllLeaveBalances(): Promise<
    { employeeId: string; acquired: number; taken: number; remaining: number }[]
  > {
    return await this.leaveDAO.getAllLeaveBalances();
  }

  async getAbsenceCalendar(): Promise<
    {
      date: string;
      absences: {
        employeeId: string;
        leaveType: string;
      }[];
    }[]
  > {
    return await this.leaveDAO.getAbsenceCalendar();
  }

  async getStatistics(
    year: number,
    employeeId?: string
  ): Promise<LeaveStatsDTO> {
    return await this.leaveDAO.getStatistics(year, employeeId);
  }

  async validateAsAdmin(id: string, validatorId: string): Promise<void> {
    const leave = await this.leaveDAO.findById(id);
    if (!leave || leave.status !== ValidationStatus.AWAITING_ADMIN_VALIDATION) {
      throw new ValidationException(
        'Statut incompatible pour validation admin'
      );
    }

    await this.leaveDAO.validateByAdmin(id, validatorId);

    const superAdmins = await this.userDAO.findAllByRoles(['SUPER_ADMIN']);
    await this.notificationService.notifyMany(
      superAdmins.map((a) => a.id),
      'LEAVE_TO_FINAL_VALIDATE',
      'Validation finale requise',
      `Congé ${leave.id} à valider définitivement`,
      `${config.server.frontend}/leaves`
    );
  }

  async validateAsSuperAdmin(id: string, validatorId: string): Promise<void> {
    const leave = await this.leaveDAO.findById(id);
    if (
      !leave ||
      leave.status !== ValidationStatus.AWAITING_SUPERADMIN_VALIDATION
    ) {
      throw new ValidationException(
        'Statut incompatible pour validation super admin'
      );
    }

    await this.leaveDAO.validateBySuperAdmin(id, validatorId);

    await this.notificationService.notify(
      leave.reviewedBy!,
      'LEAVE_VALIDATED',
      'Votre congé a été validée',
      `Votre congé a été validée, identifiant : ${leave.id}`,
      `${config.server.frontend}/leaves`
    );
  }

  async reject(id: string, reason: string): Promise<void> {
    const leave = await this.leaveDAO.findById(id);
    if (!leave || leave.status === ValidationStatus.VALIDATED) {
      throw new ValidationException('Impossible de rejeter ce congé');
    }

    if (!reason) {
      throw new ValidationException('Le motif du rejet est obligatoire');
    }

    await this.leaveDAO.reject(id, reason);

    await this.notificationService.notify(
      leave.reviewedBy!,
      'leave_REJECTED',
      'Votre congé a été rejetée',
      `Votre congé a été rejetée, identifiant : ${leave.id} — Raison : ${reason}`,
      `${config.server.frontend}/leaves`
    );
  }

  async updateStatus(id: string, status: ValidationStatus): Promise<LeaveDTO> {
    const leave = await this.leaveDAO.findById(id);
    if (!leave) throw new ResourceNotFoundException('Dépense non trouvée');

    const updatedEntity = await this.leaveDAO.updateStatus(id, status);

    const creator = await this.userDAO.findById(leave.reviewedBy!);

    if (!creator) {
      logger.warn(`Aucun utilisateur trouvé pour la dépense ${id}`);
      return toLeaveDTO(updatedEntity);
    }

    const leaveId = leave.id;

    if (status === ValidationStatus.AWAITING_ADMIN_VALIDATION) {
      const admins = await this.userDAO.findAllByRoles(['ADMIN']);
      await this.notificationService.notifyMany(
        admins.map((a) => a.id),
        'LEAVE_TO_VALIDATE',
        'Validation dépense',
        `Dépense ${leaveId} à valider`,
        `${config.server.frontend}/leaves`
      );
    } else if (status === ValidationStatus.AWAITING_SUPERADMIN_VALIDATION) {
      const superAdmins = await this.userDAO.findAllByRoles(['SUPER_ADMIN']);
      await this.notificationService.notifyMany(
        superAdmins.map((a) => a.id),
        'LEAVE_TO_FINAL_VALIDATE',
        'Validation finale dépense requise',
        `Dépense ${leaveId} à valider définitivement`,
        `${config.server.frontend}/leaves`
      );
    }

    return toLeaveDTO(updatedEntity);
  }
}
