/* eslint-disable no-unused-vars */
import { FastifyRequest, FastifyReply } from 'fastify';
import { DashboardService } from '../service/DashboardService';

export class DashboardController {
  static async globalDashboard(
    req: FastifyRequest,
    res: FastifyReply,
    service: DashboardService
  ) {
    const userId = req.user?.id;
    const roles = req.user?.roles || [];

    if (roles.includes('SUPER_ADMIN')) {
      const stats = await service.getSuperAdminStatistics();
      return res.send({ role: 'SUPER_ADMIN', stats });
    }

    if (roles.includes('ADMIN')) {
      const stats = await service.getAdminStatistics(userId);
      return res.send({ role: 'ADMIN', stats });
    }

    if (roles.includes('ADVISOR')) {
      const stats = await service.getAdvisorStatistics(userId);
      return res.send({ role: 'ADVISOR', stats });
    }

    return res.status(403).send({ message: 'Rôle non autorisé' });
  }

  static async getSummary(
    request: FastifyRequest,
    reply: FastifyReply,
    service: DashboardService
  ) {
    const summary = await service.getSummary();
    return reply.send(summary);
  }

  static async getSalaryEvolution(
    request: FastifyRequest,
    reply: FastifyReply,
    service: DashboardService
  ) {
    const { year } = request.query as { year: string };
    const data = await service.getMonthlySalaryEvolution(parseInt(year));
    return reply.send(data);
  }

  static async getExpenseDistribution(
    request: FastifyRequest,
    reply: FastifyReply,
    service: DashboardService
  ) {
    const { year, month } = request.query as { year: string; month?: string };
    const data = await service.getExpenseDistribution(
      parseInt(year),
      month ? parseInt(month) : undefined
    );
    return reply.send(data);
  }
}
