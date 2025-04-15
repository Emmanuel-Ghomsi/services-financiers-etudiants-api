/* eslint-disable no-unused-vars */
export interface DashboardAdvisorDAO {
  getFilesCreatedBy(userId: string): Promise<number>;
  getValidatedFilesCreatedBy(userId: string): Promise<number>;
}
