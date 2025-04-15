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
}
