/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { NotificationDAO } from './NotificationDAO';
import { NotificationEntity } from '../entity/NotificationEntity';

export class NotificationDAOImpl implements NotificationDAO {
  constructor(private prisma: PrismaClient) {}

  async create(
    data: Omit<NotificationEntity, 'id' | 'createdAt' | 'isRead'>
  ): Promise<NotificationEntity> {
    const notif = await this.prisma.notification.create({
      data: {
        ...data,
        isRead: false,
      },
    });
    return new NotificationEntity(notif);
  }

  async findUnreadByUser(userId: string): Promise<NotificationEntity[]> {
    const list = await this.prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' },
    });
    return list.map((n) => new NotificationEntity(n));
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
  }
}
