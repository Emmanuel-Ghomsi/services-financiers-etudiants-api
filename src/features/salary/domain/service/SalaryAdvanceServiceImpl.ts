/* eslint-disable no-unused-vars */
import { SalaryAdvanceService } from './SalaryAdvanceService';
import { SalaryAdvanceDAO } from '@features/salary/data/dao/SalaryAdvanceDAO';
import { CreateSalaryAdvanceRequest } from '@features/salary/presentation/payload/CreateSalaryAdvanceRequest';
import { UpdateSalaryAdvanceStatusRequest } from '@features/salary/presentation/payload/UpdateSalaryAdvanceStatusRequest';
import { SalaryAdvanceDTO } from '@features/salary/presentation/dto/SalaryAdvanceDTO';
import { toSalaryAdvanceDTO } from '@features/salary/presentation/mapper/SalaryAdvanceMapper';

export class SalaryAdvanceServiceImpl implements SalaryAdvanceService {
  constructor(private readonly dao: SalaryAdvanceDAO) {}

  async requestAdvance(
    data: CreateSalaryAdvanceRequest
  ): Promise<SalaryAdvanceDTO> {
    const created = await this.dao.create(data);
    return toSalaryAdvanceDTO(created);
  }

  async updateStatus(
    id: string,
    data: UpdateSalaryAdvanceStatusRequest
  ): Promise<void> {
    await this.dao.updateStatus(id, data.status);
  }

  async getEmployeeHistory(employeeId: string): Promise<SalaryAdvanceDTO[]> {
    const history = await this.dao.findAllByEmployee(employeeId);
    return history.map(toSalaryAdvanceDTO);
  }

  async getApprovedAdvanceTotal(
    employeeId: string,
    year: string,
    month: string
  ): Promise<number> {
    return this.dao.getApprovedAdvancesByEmployeeAndMonth(
      employeeId,
      year,
      month
    );
  }
}
