/* eslint-disable no-unused-vars */
import { ValidationStatus } from '@prisma/client';
import { SalaryAdvanceEntity } from '../entity/SalaryAdvanceEntity';

export interface SalaryAdvanceDAO {
  create(data: Partial<SalaryAdvanceEntity>): Promise<SalaryAdvanceEntity>;
  findById(id: string): Promise<SalaryAdvanceEntity | null>;
  findAllByEmployee(employeeId: string): Promise<SalaryAdvanceEntity[]>;
  updateStatus(
    id: string,
    status: ValidationStatus
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
  updateStatus(
    id: string,
    status: ValidationStatus
  ): Promise<SalaryAdvanceEntity>;
  validateByAdmin(salaryId: string, validatorId: string): Promise<void>;
  validateBySuperAdmin(salaryId: string, validatorId: string): Promise<void>;
  reject(salaryId: string, reason: string): Promise<void>;
  findApprovedByEmployeeAndMonth(
    employeeId: string,
    year: string,
    month: string
  ): Promise<SalaryAdvanceEntity[]>;
}
