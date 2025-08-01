/* eslint-disable no-unused-vars */
import { CreateSalaryAdvanceRequest } from '@features/salary/presentation/payload/CreateSalaryAdvanceRequest';
import { SalaryAdvanceDTO } from '@features/salary/presentation/dto/SalaryAdvanceDTO';
import { ValidationStatus } from '@prisma/client';

export interface SalaryAdvanceService {
  requestAdvance(data: CreateSalaryAdvanceRequest): Promise<SalaryAdvanceDTO>;
  getEmployeeHistory(employeeId: string): Promise<SalaryAdvanceDTO[]>;
  getApprovedAdvanceTotal(
    employeeId: string,
    year: string,
    month: string
  ): Promise<number>;
  findAll(): Promise<SalaryAdvanceDTO[]>;
  update(
    id: string,
    data: Partial<SalaryAdvanceDTO>
  ): Promise<SalaryAdvanceDTO>;
  delete(id: string): Promise<void>;
  validateAsAdmin(id: string, validatorId: string): Promise<void>;
  validateAsSuperAdmin(id: string, validatorId: string): Promise<void>;
  reject(id: string, reason: string): Promise<void>;
  updateStatus(id: string, status: ValidationStatus): Promise<SalaryAdvanceDTO>;
}
