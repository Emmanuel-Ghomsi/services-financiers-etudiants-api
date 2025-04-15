/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { DashboardAdvisorDAO } from './DashboardAdvisorDAO';

export class DashboardAdvisorDAOImpl implements DashboardAdvisorDAO {
  constructor(private readonly prisma: PrismaClient) {}

  async getFilesCreatedBy(userId: string): Promise<number> {
    return this.prisma.clientFile.count({
      where: { creatorId: userId },
    });
  }

  async getValidatedFilesCreatedBy(userId: string): Promise<number> {
    return this.prisma.clientFile.count({
      where: {
        creatorId: userId,
        status: 'VALIDATED',
      },
    });
  }
}
