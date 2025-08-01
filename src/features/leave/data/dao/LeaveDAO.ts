/* eslint-disable no-unused-vars */
import { LeaveStatsDTO } from '@features/leave/presentation/dto/LeaveStatsDTO';
import { LeaveEntity } from '../entity/LeaveEntity';
import { LeaveBalanceDTO } from '@features/leave/presentation/dto/LeaveBalanceDTO';
import { LeaveType, ValidationStatus } from '@prisma/client';

export interface LeaveDAO {
  create(data: Partial<LeaveEntity>): Promise<LeaveEntity>;
  findById(id: string): Promise<LeaveEntity | null>;
  findAll(): Promise<LeaveEntity[]>;
  findByEmployee(employeeId: string): Promise<LeaveEntity[]>;
  update(id: string, data: Partial<LeaveEntity>): Promise<LeaveEntity>;
  delete(id: string): Promise<void>;
  findAndCount(
    offset: number,
    limit: number,
    filters?: {
      employeeUsername?: string;
      leaveType?: LeaveType;
      status?: ValidationStatus;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<[LeaveEntity[], number]>;
  getAllLeaveBalances(): Promise<
    { employeeId: string; acquired: number; taken: number; remaining: number }[]
  >;
  getAbsenceCalendar(): Promise<
    {
      date: string;
      absences: {
        employeeId: string;
        leaveType: string;
      }[];
    }[]
  >;
  getStatistics(year: number, employeeId?: string): Promise<LeaveStatsDTO>;
  getLeaveBalance(employeeId: string, year: number): Promise<LeaveBalanceDTO>;
  updateStatus(id: string, status: ValidationStatus): Promise<LeaveEntity>;
  validateByAdmin(LeaveId: string, validatorId: string): Promise<void>;
  validateBySuperAdmin(LeaveId: string, validatorId: string): Promise<void>;
  reject(LeaveId: string, reason: string): Promise<void>;
}
