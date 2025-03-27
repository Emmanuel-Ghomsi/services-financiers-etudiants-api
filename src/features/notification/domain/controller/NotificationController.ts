import { FastifyRequest, FastifyReply } from 'fastify';
import { NotificationService } from '../service/NotificationService';
import { toNotificationDTO } from '@features/notification/presentation/mapper/NotificationMapper';

export class NotificationController {
  /**
   * Récupère les notifications non lues
   */
  static async getAll(
    req: FastifyRequest,
    res: FastifyReply,
    service: NotificationService
  ) {
    const userId = req.user?.id;
    const notifications = await service.getUnreadForUser(userId);
    const dtos = notifications.map(toNotificationDTO);
    res.send(dtos);
  }

  /**
   * Marque toutes les notifications comme lues
   */
  static async markAllAsRead(
    req: FastifyRequest,
    res: FastifyReply,
    service: NotificationService
  ) {
    const userId = req.user?.id;
    await service.markAllAsRead(userId);
    res.send({ message: 'Toutes les notifications sont marquées comme lues.' });
  }
}
