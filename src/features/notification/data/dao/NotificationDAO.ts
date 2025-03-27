/* eslint-disable no-unused-vars */
import { NotificationEntity } from '../entity/NotificationEntity';

export interface NotificationDAO {
  create(
    notification: Omit<NotificationEntity, 'id' | 'createdAt' | 'isRead'>
  ): Promise<NotificationEntity>;
  findUnreadByUser(userId: string): Promise<NotificationEntity[]>;
  markAllAsRead(userId: string): Promise<void>;
}
