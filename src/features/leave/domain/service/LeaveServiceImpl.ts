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

export class LeaveServiceImpl implements LeaveService {
  constructor(private readonly leaveDAO: LeaveDAO) {}

  async createLeave(request: CreateLeaveRequest): Promise<LeaveDTO> {
    const entity = new LeaveEntity({
      id: uuidv4(),
      employeeId: request.employeeId,
      leaveType: request.leaveType,
      startDate: request.startDate,
      endDate: request.endDate,
      comment: request.comment ?? null,
      status: 'PENDING',
      reviewedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.leaveDAO.create(entity);
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
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    const [items, totalItems] = await this.leaveDAO.findAndCount(offset, limit);
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
}
