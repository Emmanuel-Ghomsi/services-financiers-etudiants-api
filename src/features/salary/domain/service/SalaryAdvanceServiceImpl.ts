/* eslint-disable no-unused-vars */
import { SalaryAdvanceService } from './SalaryAdvanceService';
import { SalaryAdvanceDAO } from '@features/salary/data/dao/SalaryAdvanceDAO';
import { CreateSalaryAdvanceRequest } from '@features/salary/presentation/payload/CreateSalaryAdvanceRequest';
import { UpdateSalaryAdvanceStatusRequest } from '@features/salary/presentation/payload/UpdateSalaryAdvanceStatusRequest';
import { SalaryAdvanceDTO } from '@features/salary/presentation/dto/SalaryAdvanceDTO';
import { toSalaryAdvanceDTO } from '@features/salary/presentation/mapper/SalaryAdvanceMapper';
import { SalaryAdvanceEntity } from '@features/salary/data/entity/SalaryAdvanceEntity';
import { SalaryAdvanceStatus } from '@prisma/client';

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
  ): Promise<SalaryAdvanceDTO> {
    const updated = await this.dao.updateStatus(id, data.status);
    return toSalaryAdvanceDTO(updated);
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

  async findAll(): Promise<SalaryAdvanceDTO[]> {
    const list = await this.dao.findAll();
    return list.map(toSalaryAdvanceDTO);
  }

  async update(
    id: string,
    data: Partial<SalaryAdvanceDTO>
  ): Promise<SalaryAdvanceDTO> {
    const entityCompatible: Partial<SalaryAdvanceEntity> = {
      ...data,
      requestedDate: data.requestedDate
        ? new Date(data.requestedDate)
        : undefined,
      createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
      status: data.status as SalaryAdvanceStatus | undefined,
    };

    const updated = await this.dao.update(id, entityCompatible);
    return toSalaryAdvanceDTO(updated);
  }

  async delete(id: string): Promise<void> {
    await this.dao.delete(id);
  }
}
