import { FastifyInstance } from 'fastify';
import { NotificationService } from '../service/NotificationService';
import { NotificationController } from '../controller/NotificationController';

export async function registerNotificationRoutes(
  app: FastifyInstance,
  service: NotificationService
) {
  const prefix = '/notifications';

  // 📥 Récupérer les notifications non lues
  app.get(
    prefix,
    {
      schema: {
        tags: ['Notification'],
        summary: 'Récupérer les notifications non lues',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) => NotificationController.getAll(req, res, service)
  );

  // ✅ Marquer comme lues
  app.patch(
    `${prefix}/read`,
    {
      schema: {
        tags: ['Notification'],
        summary: 'Marquer toutes les notifications comme lues',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) => NotificationController.markAllAsRead(req, res, service)
  );
}
