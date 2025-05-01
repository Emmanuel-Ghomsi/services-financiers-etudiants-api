/* eslint-disable no-unused-vars */
import { WebSocketRegistry } from '@core/socket/WebSocketRegistry';
import { NotificationDAO } from '@features/notification/data/dao/NotificationDAO';
import { NotificationEntity } from '@features/notification/data/entity/NotificationEntity';

export class NotificationService {
  constructor(private dao: NotificationDAO) {}

  async notify(
    userId: string,
    type: string,
    title: string,
    message: string,
    targetUrl?: string
  ) {
    const notif = await this.dao.create({
      userId,
      type,
      title,
      message,
      targetUrl,
    });
    WebSocketRegistry.notifyUser(userId, {
      type,
      title,
      message,
      targetUrl,
      createdAt: notif.createdAt,
    });
  }

  async notifyMany(
    userIds: string[],
    type: string,
    title: string,
    message: string,
    targetUrl?: string
  ) {
    for (const userId of userIds) {
      await this.notify(userId, type, title, message, targetUrl);
    }
  }

  async getUnreadForUser(userId: string): Promise<NotificationEntity[]> {
    return await this.dao.findUnreadByUser(userId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    return await this.dao.markAllAsRead(userId);
  }
}
