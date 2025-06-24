/* eslint-disable no-unused-vars */
import { SalaryAdvanceStatus } from '@prisma/client';
import { SalaryAdvanceEntity } from '../entity/SalaryAdvanceEntity';

export interface SalaryAdvanceDAO {
  create(data: Partial<SalaryAdvanceEntity>): Promise<SalaryAdvanceEntity>;
  findById(id: string): Promise<SalaryAdvanceEntity | null>;
  findAllByEmployee(employeeId: string): Promise<SalaryAdvanceEntity[]>;
  updateStatus(
    id: string,
    status: SalaryAdvanceStatus
  ): Promise<SalaryAdvanceEntity>;
  getApprovedAdvancesByEmployeeAndMonth(
    employeeId: string,
    year: string,
    month: string
  ): Promise<number>;
  findAll(): Promise<SalaryAdvanceEntity[]>;
  update(
    id: string,
    data: Partial<SalaryAdvanceEntity>
  ): Promise<SalaryAdvanceEntity>;
  delete(id: string): Promise<void>;
}
