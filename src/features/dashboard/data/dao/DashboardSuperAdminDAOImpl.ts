/* eslint-disable no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { DashboardSuperAdminDAO } from './DashboardSuperAdminDAO';

export class DashboardSuperAdminDAOImpl implements DashboardSuperAdminDAO {
  constructor(private readonly prisma: PrismaClient) {}

  async getTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }

  async getTotalAdvisors(): Promise<number> {
    return this.prisma.userToRole.count({
      where: { role: { name: 'ADVISOR' } },
    });
  }

  async getTotalAdmins(): Promise<number> {
    return this.prisma.userToRole.count({
      where: { role: { name: 'ADMIN' } },
    });
  }

  async getPendingSuperAdminValidations(): Promise<number> {
    return this.prisma.clientFile.count({
      where: { status: 'AWAITING_SUPERADMIN_VALIDATION' },
    });
  }

  async getTotalValidatedFiles(): Promise<number> {
    return this.prisma.clientFile.count({
      where: { status: 'VALIDATED' },
    });
  }
}
