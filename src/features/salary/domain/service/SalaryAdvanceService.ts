/* eslint-disable no-unused-vars */
import { CreateSalaryAdvanceRequest } from '@features/salary/presentation/payload/CreateSalaryAdvanceRequest';
import { UpdateSalaryAdvanceStatusRequest } from '@features/salary/presentation/payload/UpdateSalaryAdvanceStatusRequest';
import { SalaryAdvanceDTO } from '@features/salary/presentation/dto/SalaryAdvanceDTO';

export interface SalaryAdvanceService {
  requestAdvance(data: CreateSalaryAdvanceRequest): Promise<SalaryAdvanceDTO>;
  updateStatus(
    id: string,
    data: UpdateSalaryAdvanceStatusRequest
  ): Promise<void>;
  getEmployeeHistory(employeeId: string): Promise<SalaryAdvanceDTO[]>;
  getApprovedAdvanceTotal(
    employeeId: string,
    year: string,
    month: string
  ): Promise<number>;
}
