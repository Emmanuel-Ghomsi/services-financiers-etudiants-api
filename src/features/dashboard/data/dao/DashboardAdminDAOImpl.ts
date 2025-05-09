/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { DashboardAdminDAO } from './DashboardAdminDAO';

export class DashboardAdminDAOImpl implements DashboardAdminDAO {
  constructor(private readonly prisma: PrismaClient) {}

  async getFilesCreatedBy(userId: string): Promise<number> {
    return this.prisma.clientFile.count({
      where: { creatorId: userId },
    });
  }

  async getPendingAdminValidations(): Promise<number> {
    return this.prisma.clientFile.count({
      where: { status: 'AWAITING_ADMIN_VALIDATION' },
    });
  }

  async getValidatedBy(userId: string): Promise<number> {
    return this.prisma.clientFile.count({
      where: { validatorAdminId: userId },
    });
  }
}
