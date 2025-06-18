/* eslint-disable no-unused-vars */
import { FastifyRequest, FastifyReply } from 'fastify';
import { SalaryService } from '../service/SalaryService';
import { CreateSalaryRequestSchema } from '@features/salary/presentation/payload/CreateSalaryRequest';
import { UpdateSalaryRequestSchema } from '@features/salary/presentation/payload/UpdateSalaryRequest';
import { SalaryListRequestSchema } from '@features/salary/presentation/payload/SalaryListRequest';
import { zParse } from '@core/utils/utils';
import { SalaryPeriodFilterRequestSchema } from '@features/salary/presentation/payload/SalaryPeriodFilterRequest';
import { SalaryPeriodPaginatedRequestSchema } from '@features/salary/presentation/payload/SalaryPeriodPaginatedRequest';

export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  async createSalary(request: FastifyRequest, reply: FastifyReply) {
    const body = await zParse(request, CreateSalaryRequestSchema);
    const result = await this.salaryService.createSalary(body);
    return reply.code(201).send(result);
  }

  async updateSalary(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = await zParse(request, UpdateSalaryRequestSchema);
    const result = await this.salaryService.updateSalary(id, body);
    return reply.send(result);
  }

  async getSalaryById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await this.salaryService.getSalaryById(id);
    if (!result) return reply.code(404).send({ message: 'Fiche non trouvée' });
    return reply.send(result);
  }

  async getPaginatedSalaries(request: FastifyRequest, reply: FastifyReply) {
    const query = await zParse(request, SalaryListRequestSchema);
    const result = await this.salaryService.getPaginatedSalaries(query);
    return reply.send(result);
  }

  async getSalariesByEmployee(request: FastifyRequest, reply: FastifyReply) {
    const { employeeName } = request.params as { employeeName: string };
    const result = await this.salaryService.getSalariesByEmployee(employeeName);
    return reply.send(result);
  }

  async deleteSalary(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await this.salaryService.deleteSalary(id);
    return reply.code(204).send();
  }

  async getSalaryPdfData(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await this.salaryService.getSalaryPdfData(id);
    return reply.send(result);
  }

  async getSalariesByPeriod(request: FastifyRequest, reply: FastifyReply) {
    const { month, year } = await zParse(
      request,
      SalaryPeriodFilterRequestSchema
    );
    const result = await this.salaryService.getSalariesByPeriod(month, year);
    return reply.send(result);
  }

  async getSalariesByPeriodPaginated(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { month, year, page, limit } = await zParse(
      request,
      SalaryPeriodPaginatedRequestSchema
    );
    const result = await this.salaryService.getSalariesByPeriodPaginated(
      month,
      year,
      page,
      limit
    );
    return reply.send(result);
  }
}
