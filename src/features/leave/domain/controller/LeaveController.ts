/* eslint-disable no-unused-vars */
import { FastifyRequest, FastifyReply } from 'fastify';
import { LeaveService } from '../service/LeaveService';
import { CreateLeaveRequestSchema } from '@features/leave/presentation/payload/CreateLeaveRequest';
import { UpdateLeaveRequestSchema } from '@features/leave/presentation/payload/UpdateLeaveRequest';
import { LeaveListRequestSchema } from '@features/leave/presentation/payload/LeaveListRequest';
import { zParse } from '@core/utils/utils';
import { LeaveStatsRequestSchema } from '@features/leave/presentation/payload/LeaveStatsRequest';
import { LeaveBalanceRequestSchema } from '@features/leave/presentation/payload/LeaveBalanceRequest';

export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  async createLeave(request: FastifyRequest, reply: FastifyReply) {
    const body = await zParse(request, CreateLeaveRequestSchema);
    const result = await this.leaveService.createLeave(body);
    return reply.code(201).send(result);
  }

  async updateLeave(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const body = await zParse(request, UpdateLeaveRequestSchema);
    const result = await this.leaveService.updateLeave(id, body);
    return reply.send(result);
  }

  async getLeaveById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const result = await this.leaveService.getLeaveById(id);
    if (!result) return reply.code(404).send({ message: 'Congé non trouvé' });
    return reply.send(result);
  }

  async getLeavesByEmployee(request: FastifyRequest, reply: FastifyReply) {
    const { employeeId } = request.params as { employeeId: string };
    const result = await this.leaveService.getLeavesByEmployee(employeeId);
    return reply.send(result);
  }

  async getPaginatedLeaves(request: FastifyRequest, reply: FastifyReply) {
    const query = await zParse(request, LeaveListRequestSchema);
    const result = await this.leaveService.getPaginatedLeaves(query);
    return reply.send(result);
  }

  async deleteLeave(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    await this.leaveService.deleteLeave(id);
    return reply.code(204).send();
  }

  async getLeaveBalance(request: FastifyRequest, reply: FastifyReply) {
    const { employeeId, year } = await zParse(
      request,
      LeaveBalanceRequestSchema
    );
    const result = await this.leaveService.getLeaveBalance(employeeId, year);
    return reply.send(result);
  }

  async getAllLeaveBalances(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.leaveService.getAllLeaveBalances();
    return reply.send(result);
  }

  async getAbsenceCalendar(request: FastifyRequest, reply: FastifyReply) {
    const result = await this.leaveService.getAbsenceCalendar();
    return reply.send(result);
  }

  async getStatistics(request: FastifyRequest, reply: FastifyReply) {
    const { year, employeeId } = await zParse(request, LeaveStatsRequestSchema);
    const result = await this.leaveService.getStatistics(year, employeeId);
    return reply.send(result);
  }
}
