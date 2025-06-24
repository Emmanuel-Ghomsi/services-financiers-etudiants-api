import { FastifyInstance } from 'fastify';
import { DashboardService } from '../service/DashboardService';
import { DashboardController } from '../controller/DashboardController';

export async function registerDashboardRoutes(
  app: FastifyInstance,
  service: DashboardService
) {
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

  app.get(
    '/dashboard/summary',
    {
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
      preHandler: [
        app.authenticate,
        app.authorize(['SUPER_ADMIN', 'ADMIN', 'RH', 'ACCOUNTANT']),
      ],
    },
    async (req, res) => DashboardController.getSummary(req, res, service)
  );

  app.get(
    '/dashboard/salary-evolution',
    {
      preHandler: [
        app.authenticate,
        app.authorize(['SUPER_ADMIN', 'ADMIN', 'RH', 'ACCOUNTANT']),
      ],
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
    },
    async (req, res) =>
      DashboardController.getSalaryEvolution(req, res, service)
  );

  app.get(
    '/dashboard/expense-distribution',
    {
      preHandler: [
        app.authenticate,
        app.authorize(['SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT']),
      ],
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
    },
    async (req, res) =>
      DashboardController.getExpenseDistribution(req, res, service)
  );
}
