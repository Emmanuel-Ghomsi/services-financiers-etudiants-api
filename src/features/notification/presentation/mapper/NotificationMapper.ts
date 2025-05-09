import { NotificationEntity } from '@features/notification/data/entity/NotificationEntity';
import { NotificationDTO } from '../dto/NotificationDTO';

/**
 * Transforme une entité notification en DTO pour le frontend
 */
export function toNotificationDTO(entity: NotificationEntity): NotificationDTO {
  return {
    id: entity.id,
    type: entity.type,
    title: entity.title,
    message: entity.message,
    isRead: entity.isRead,
    createdAt: entity.createdAt,
    targetUrl: entity.targetUrl,
  };
}
