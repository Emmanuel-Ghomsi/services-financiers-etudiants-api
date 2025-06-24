/* eslint-disable no-unused-vars */
import { CreateSalaryAdvanceRequest } from '@features/salary/presentation/payload/CreateSalaryAdvanceRequest';
import { UpdateSalaryAdvanceStatusRequest } from '@features/salary/presentation/payload/UpdateSalaryAdvanceStatusRequest';
import { SalaryAdvanceDTO } from '@features/salary/presentation/dto/SalaryAdvanceDTO';

export interface SalaryAdvanceService {
  requestAdvance(data: CreateSalaryAdvanceRequest): Promise<SalaryAdvanceDTO>;
  updateStatus(
    id: string,
    data: UpdateSalaryAdvanceStatusRequest
  ): Promise<SalaryAdvanceDTO>;
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
}
