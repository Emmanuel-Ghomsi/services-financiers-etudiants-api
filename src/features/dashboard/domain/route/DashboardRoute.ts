import { FastifyInstance } from 'fastify';
import { DashboardService } from '../service/DashboardService';
import { DashboardController } from '../controller/DashboardController';

export async function registerDashboardRoutes(
  app: FastifyInstance,
  service: DashboardService
) {
  const controller = new DashboardController(service);

  app.get(
    '/dashboard',
    {
      schema: {
        tags: ['Dashboard'],
        summary: 'Statistiques du tableau de bord selon le rôle',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) => DashboardController.globalDashboard(req, res, service)
  );

  app.get('/dashboard/summary', {
    preHandler: [app.authorize(['ADMIN', 'RH', 'ACCOUNTANT'])],
    schema: {
      tags: ['Dashboard'],
      summary: 'Résumé global (salaires, avances, congés, dépenses)',
      response: {
        200: {
          type: 'object',
          properties: {
            totalSalaries: { type: 'number' },
            pendingAdvances: { type: 'number' },
            monthlyExpenses: { type: 'number' },
            activeLeaves: { type: 'number' },
          },
        },
      },
    },
    handler: controller.getSummary.bind(controller),
  });

  app.get('/dashboard/salary-evolution', {
    preHandler: [app.authorize(['ADMIN', 'RH', 'ACCOUNTANT'])],
    schema: {
      tags: ['Dashboard'],
      summary: 'Évolution des salaires mensuels sur une année',
      querystring: {
        type: 'object',
        properties: {
          year: { type: 'string' },
        },
        required: ['year'],
      },
    },
    handler: controller.getSalaryEvolution.bind(controller),
  });

  app.get('/dashboard/expense-distribution', {
    preHandler: [app.authorize(['ADMIN', 'ACCOUNTANT'])],
    schema: {
      tags: ['Dashboard'],
      summary: 'Répartition des dépenses par catégorie',
      querystring: {
        type: 'object',
        properties: {
          year: { type: 'string' },
          month: { type: 'string' },
        },
        required: ['year'],
      },
    },
    handler: controller.getExpenseDistribution.bind(controller),
  });
}
