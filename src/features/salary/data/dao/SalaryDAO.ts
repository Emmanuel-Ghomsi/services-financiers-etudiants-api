/* eslint-disable no-unused-vars */
import { SalaryEntity } from '../entity/SalaryEntity';

export interface SalaryDAO {
  create(data: Partial<SalaryEntity>): Promise<SalaryEntity>;
  findById(id: string): Promise<SalaryEntity | null>;
  findAll(): Promise<SalaryEntity[]>;
  delete(id: string): Promise<void>;
  update(id: string, data: Partial<SalaryEntity>): Promise<SalaryEntity>;
  findByEmployee(employeeId: string): Promise<SalaryEntity[]>;
  findAndCount(
    offset: number,
    limit: number
  ): Promise<[SalaryEntity[], number]>;
  findByPeriod(month: number, year: number): Promise<SalaryEntity[]>;
  findByPeriodPaginated(
    month: number,
    year: number,
    offset: number,
    limit: number
  ): Promise<[SalaryEntity[], number]>;
}
