/* eslint-disable no-unused-vars */
export interface DashboardDAO {
  getTotalSalariesThisMonth(): Promise<number>;
  getPendingAdvancesCount(): Promise<number>;
  getMonthlyExpensesTotal(): Promise<number>;
  getActiveLeavesCount(): Promise<number>;
  getMonthlySalaryEvolution(
    year: number
  ): Promise<{ month: number; total: number }[]>;
  getExpenseDistribution(
    year: number,
    month?: number
  ): Promise<{ category: string; total: number }[]>;
}
