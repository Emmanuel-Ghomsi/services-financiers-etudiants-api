/* eslint-disable no-unused-vars */
import { CreateLeaveRequest } from '@features/leave/presentation/payload/CreateLeaveRequest';
import { UpdateLeaveRequest } from '@features/leave/presentation/payload/UpdateLeaveRequest';
import { LeaveDTO } from '@features/leave/presentation/dto/LeaveDTO';
import { LeavePaginationDTO } from '@features/leave/presentation/dto/LeavePaginationDTO';
import { LeaveListRequest } from '@features/leave/presentation/payload/LeaveListRequest';
import { LeaveStatsDTO } from '@features/leave/presentation/dto/LeaveStatsDTO';
import { LeaveBalanceDTO } from '@features/leave/presentation/dto/LeaveBalanceDTO';
import { ValidationStatus } from '@prisma/client';

export interface LeaveService {
  createLeave(request: CreateLeaveRequest): Promise<LeaveDTO>;
  updateLeave(id: string, request: UpdateLeaveRequest): Promise<LeaveDTO>;
  getLeaveById(id: string): Promise<LeaveDTO | null>;
  getLeavesByEmployee(employeeId: string): Promise<LeaveDTO[]>;
  getPaginatedLeaves(query: LeaveListRequest): Promise<LeavePaginationDTO>;
  deleteLeave(id: string): Promise<void>;
  getLeaveBalance(employeeId: string, year: number): Promise<LeaveBalanceDTO>;

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
  validateAsAdmin(id: string, validatorId: string): Promise<void>;
  validateAsSuperAdmin(id: string, validatorId: string): Promise<void>;
  reject(id: string, reason: string): Promise<void>;
  updateStatus(id: string, status: ValidationStatus): Promise<LeaveDTO>;
}
