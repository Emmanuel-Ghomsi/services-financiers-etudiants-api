/* eslint-disable no-unused-vars */
import { CreateSalaryRequest } from '@features/salary/presentation/payload/CreateSalaryRequest';
import { UpdateSalaryRequest } from '@features/salary/presentation/payload/UpdateSalaryRequest';
import { SalaryDTO } from '@features/salary/presentation/dto/SalaryDTO';
import { SalaryPaginationDTO } from '@features/salary/presentation/dto/SalaryPaginationDTO';
import { SalaryListRequest } from '@features/salary/presentation/payload/SalaryListRequest';
import { SalaryPdfDataDTO } from '@features/salary/presentation/dto/SalaryPdfDataDTO';
import { SalaryPeriodDTO } from '@features/salary/presentation/dto/SalaryPeriodDTO';
import { SalaryPeriodPaginationDTO } from '@features/salary/presentation/dto/SalaryPeriodPaginationDTO';

export interface SalaryService {
  createSalary(request: CreateSalaryRequest): Promise<SalaryDTO>;
  updateSalary(id: string, request: UpdateSalaryRequest): Promise<SalaryDTO>;
  getSalaryById(id: string): Promise<SalaryDTO | null>;
  getPaginatedSalaries(query: SalaryListRequest): Promise<SalaryPaginationDTO>;
  getSalariesByEmployee(employeeName: string): Promise<SalaryDTO[]>;
  deleteSalary(id: string): Promise<void>;
  getSalaryPdfData(id: string): Promise<SalaryPdfDataDTO>;
  getSalariesByEmployee(employeeId: string): Promise<SalaryDTO[]>;
  getSalariesByPeriod(month: number, year: number): Promise<SalaryPeriodDTO[]>;
  getSalariesByPeriodPaginated(
    month: number,
    year: number,
    page: number,
    limit: number
  ): Promise<SalaryPeriodPaginationDTO>;
}
