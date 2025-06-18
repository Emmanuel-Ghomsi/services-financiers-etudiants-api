import { FastifyInstance } from 'fastify';
import { SalaryAdvanceController } from '../controller/SalaryAdvanceController';
import { SalaryAdvanceService } from '../service/SalaryAdvanceService';
import { zodToSwaggerSchema } from '@core/utils/zodToSwagger';

export async function registerSalaryAdvanceRoutes(
  server: FastifyInstance,
  service: SalaryAdvanceService
) {
  const controller = new SalaryAdvanceController(service);

  server.post('/salary-advances', {
    schema: {
      tags: ['Salary Advances'],
      summary: 'Demander une avance sur salaire',
      body: zodToSwaggerSchema('CreateSalaryAdvanceRequest'),
      response: { 201: { $ref: 'SalaryAdvanceDTO' } },
    },
    handler: controller.requestAdvance.bind(controller),
  });

  server.patch('/salary-advances/:id/status', {
    schema: {
      tags: ['Salary Advances'],
      summary: 'Modifier le statut d’une avance',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      body: zodToSwaggerSchema('UpdateSalaryAdvanceStatusRequest'),
      response: {
        200: { $ref: 'SalaryAdvanceDTO' },
        400: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: controller.updateStatus.bind(controller),
  });

  server.get('/salary-advances/history/:employeeId', {
    schema: {
      tags: ['Salary Advances'],
      summary: 'Consulter l’historique des avances d’un employé',
      params: {
        type: 'object',
        properties: {
          employeeId: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      response: { 200: { type: 'array', items: { $ref: 'SalaryAdvanceDTO' } } },
    },
    handler: controller.getEmployeeHistory.bind(controller),
  });

  server.get('/salary-advances/approved-total', {
    schema: {
      tags: ['Salary Advances'],
      summary: 'Total des avances approuvées par employé et mois',
      querystring: {
        type: 'object',
        properties: {
          employeeId: { type: 'string', format: 'uuid' },
          year: { type: 'string' },
          month: { type: 'string' },
        },
        required: ['employeeId', 'year', 'month'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            total: { type: 'number' },
          },
        },
      },
    },
    handler: controller.getMonthlyApprovedAdvance.bind(controller),
  });
}
