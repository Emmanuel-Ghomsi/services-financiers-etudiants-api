/* eslint-disable no-unused-vars */
import { LeaveStatsDTO } from '@features/leave/presentation/dto/LeaveStatsDTO';
import { LeaveEntity } from '../entity/LeaveEntity';
import { LeaveBalanceDTO } from '@features/leave/presentation/dto/LeaveBalanceDTO';

export interface LeaveDAO {
  create(data: Partial<LeaveEntity>): Promise<LeaveEntity>;
  findById(id: string): Promise<LeaveEntity | null>;
  findAll(): Promise<LeaveEntity[]>;
  findByEmployee(employeeId: string): Promise<LeaveEntity[]>;
  update(id: string, data: Partial<LeaveEntity>): Promise<LeaveEntity>;
  delete(id: string): Promise<void>;
  findAndCount(offset: number, limit: number): Promise<[LeaveEntity[], number]>;
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
}
