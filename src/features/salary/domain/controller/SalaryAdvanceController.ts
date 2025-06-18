/* eslint-disable no-unused-vars */
import { FastifyRequest, FastifyReply } from 'fastify';
import { SalaryAdvanceService } from '../service/SalaryAdvanceService';
import { zParse } from '@core/utils/utils';
import { CreateSalaryAdvanceRequestSchema } from '@features/salary/presentation/payload/CreateSalaryAdvanceRequest';
import { UpdateSalaryAdvanceStatusRequestSchema } from '@features/salary/presentation/payload/UpdateSalaryAdvanceStatusRequest';

export class SalaryAdvanceController {
  constructor(private readonly service: SalaryAdvanceService) {}

  async requestAdvance(request: FastifyRequest, reply: FastifyReply) {
    const body = await zParse(request, CreateSalaryAdvanceRequestSchema);
    const result = await this.service.requestAdvance(body);
    return reply.code(201).send(result);
  }

  async updateStatus(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = await zParse(request, UpdateSalaryAdvanceStatusRequestSchema);
    await this.service.updateStatus(id, body);
    return reply.code(204).send();
  }

  async getEmployeeHistory(request: FastifyRequest, reply: FastifyReply) {
    const { employeeId } = request.params as { employeeId: string };
    const result = await this.service.getEmployeeHistory(employeeId);
    return reply.send(result);
  }

  async getMonthlyApprovedAdvance(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const { employeeId, year, month } = request.query as {
      employeeId: string;
      year: string;
      month: string;
    };

    const total = await this.service.getApprovedAdvanceTotal(
      employeeId,
      year,
      month
    );
    return reply.send({ total });
  }
}
