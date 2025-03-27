/* eslint-disable no-unused-vars */
import { WebSocketRegistry } from '@core/socket/WebSocketRegistry';
import { NotificationDAO } from '@features/notification/data/dao/NotificationDAO';
import { NotificationEntity } from '@features/notification/data/entity/NotificationEntity';

export class NotificationService {
  constructor(private dao: NotificationDAO) {}

  async notify(userId: string, type: string, title: string, message: string) {
    const notif = await this.dao.create({ userId, type, title, message });
    WebSocketRegistry.notifyUser(userId, {
      type,
      title,
      message,
      createdAt: notif.createdAt,
    });
  }

  async notifyMany(
    userIds: string[],
    type: string,
    title: string,
    message: string
  ) {
    for (const userId of userIds) {
      await this.notify(userId, type, title, message);
    }
  }

  async getUnreadForUser(userId: string): Promise<NotificationEntity[]> {
    return await this.dao.findUnreadByUser(userId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    return await this.dao.markAllAsRead(userId);
  }
}
