/* eslint-disable no-unused-vars */
import { SalaryDAO } from '@features/salary/data/dao/SalaryDAO';
import { SalaryService } from './SalaryService';
import { CreateSalaryRequest } from '@features/salary/presentation/payload/CreateSalaryRequest';
import { UpdateSalaryRequest } from '@features/salary/presentation/payload/UpdateSalaryRequest';
import { SalaryDTO } from '@features/salary/presentation/dto/SalaryDTO';
import { SalaryPaginationDTO } from '@features/salary/presentation/dto/SalaryPaginationDTO';
import { SalaryListRequest } from '@features/salary/presentation/payload/SalaryListRequest';
import { toSalaryDTO } from '@features/salary/presentation/mapper/SalaryMapper';
import { v4 as uuidv4 } from 'uuid';
import { SalaryEntity } from '@features/salary/data/entity/SalaryEntity';
import { ResourceNotFoundException } from '@core/exceptions/ResourceNotFoundException';
import { SalaryPdfDataDTO } from '@features/salary/presentation/dto/SalaryPdfDataDTO';
import { toSalaryPdfDataDTO } from '@features/salary/presentation/mapper/SalaryMapper';
import { SalaryPeriodDTO } from '@features/salary/presentation/dto/SalaryPeriodDTO';
import { SalaryPeriodPaginationDTO } from '@features/salary/presentation/dto/SalaryPeriodPaginationDTO';
import { SalaryAdvanceService } from './SalaryAdvanceService';
import { UserDAO } from '@features/auth/data/dao/UserDAO';

export class SalaryServiceImpl implements SalaryService {
  constructor(
    private readonly salaryDAO: SalaryDAO,
    private readonly salaryAdvanceService: SalaryAdvanceService,
    private readonly userDAO: UserDAO
  ) {}

  async createSalary(request: CreateSalaryRequest): Promise<SalaryDTO> {
    const { employeeId, grossSalary, deductions, paymentMode, paymentDate } =
      request;

    const date = new Date(paymentDate);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const advanceTotal =
      await this.salaryAdvanceService.getApprovedAdvanceTotal(
        employeeId,
        year,
        month
      );

    const netSalary = grossSalary - deductions - advanceTotal;

    const entity = new SalaryEntity({
      id: uuidv4(),
      employeeId,
      grossSalary,
      deductions,
      advances: advanceTotal,
      netSalary,
      paymentMode,
      paymentDate,
      payslipUrl: null,
      year,
      month,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.salaryDAO.create(entity);
    return toSalaryDTO(saved);
  }

  async updateSalary(
    id: string,
    request: UpdateSalaryRequest
  ): Promise<SalaryDTO> {
    const existing = await this.salaryDAO.findById(id);
    if (!existing) {
      throw new ResourceNotFoundException('Fiche de salaire non trouvée');
    }

    const updatedNetSalary =
      (request.grossSalary ?? existing.grossSalary) -
      (request.deductions ?? existing.deductions) -
      (request.advances ?? existing.advances);

    const updated = await this.salaryDAO.update(id, {
      ...request,
      netSalary: updatedNetSalary,
    });

    return toSalaryDTO(updated);
  }

  async getSalaryById(id: string): Promise<SalaryDTO | null> {
    const result = await this.salaryDAO.findById(id);
    return result ? toSalaryDTO(result) : null;
  }

  async getPaginatedSalaries(
    query: SalaryListRequest
  ): Promise<SalaryPaginationDTO> {
    const { page, limit } = query;
    const offset = (page - 1) * limit;
    const [items, totalItems] = await this.salaryDAO.findAndCount(
      offset,
      limit
    );
    return {
      items: items.map(toSalaryDTO),
      currentPage: page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      pageSize: items.length,
      pageLimit: limit,
    };
  }

  async getSalariesByEmployee(employeeName: string): Promise<SalaryDTO[]> {
    const results = await this.salaryDAO.findByEmployee(employeeName);
    return results.map(toSalaryDTO);
  }

  async deleteSalary(id: string): Promise<void> {
    await this.salaryDAO.delete(id);
  }

  async getSalaryPdfData(id: string): Promise<SalaryPdfDataDTO> {
    const salary = await this.salaryDAO.findById(id);
    if (!salary) throw new Error('Fiche de salaire non trouvée');
    return toSalaryPdfDataDTO(salary);
  }

  async getSalariesByPeriod(
    month: number,
    year: number
  ): Promise<SalaryPeriodDTO[]> {
    const results = await this.salaryDAO.findByPeriod(month, year);
    return results.map((s) => ({
      employeeId: s.employeeId,
      grossSalary: s.grossSalary,
      deductions: s.deductions,
      advances: s.advances,
      netSalary: s.netSalary,
      paymentDate: s.paymentDate.toISOString().split('T')[0],
    }));
  }

  async getSalariesByPeriodPaginated(
    month: number,
    year: number,
    page: number,
    limit: number
  ): Promise<SalaryPeriodPaginationDTO> {
    const offset = (page - 1) * limit;
    const [items, totalItems] = await this.salaryDAO.findByPeriodPaginated(
      month,
      year,
      offset,
      limit
    );
    return {
      items: items.map((s) => ({
        employeeId: s.employeeId,
        grossSalary: s.grossSalary,
        deductions: s.deductions,
        advances: s.advances,
        netSalary: s.netSalary,
        paymentDate: s.paymentDate.toISOString().split('T')[0],
      })),
      currentPage: page,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      pageSize: items.length,
      pageLimit: limit,
    };
  }
}
