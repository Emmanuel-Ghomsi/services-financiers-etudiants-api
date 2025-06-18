/* eslint-disable no-unused-vars */
import { DashboardAdminDTO } from '@features/dashboard/presentation/dto/DashboardAdminDTO';
import { DashboardSuperAdminDTO } from '../../presentation/dto/DashboardSuperAdminDTO';
import { DashboardAdvisorDTO } from '@features/dashboard/presentation/dto/DashboardAdvisorDTO';

export interface DashboardService {
  getSuperAdminStatistics(): Promise<DashboardSuperAdminDTO>;
  getAdminStatistics(userId: string): Promise<DashboardAdminDTO>;
  getAdvisorStatistics(userId: string): Promise<DashboardAdvisorDTO>;
  getSummary(): Promise<{
    totalSalaries: number;
    pendingAdvances: number;
    monthlyExpenses: number;
    activeLeaves: number;
  }>;
  getMonthlySalaryEvolution(
    year: number
  ): Promise<{ month: number; total: number }[]>;
  getExpenseDistribution(
    year: number,
    month?: number
  ): Promise<{ category: string; total: number }[]>;
}
