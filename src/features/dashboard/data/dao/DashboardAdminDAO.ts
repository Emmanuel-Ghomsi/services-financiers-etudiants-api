/* eslint-disable no-unused-vars */
export interface DashboardAdminDAO {
  getFilesCreatedBy(userId: string): Promise<number>;
  getPendingAdminValidations(): Promise<number>;
  getValidatedBy(userId: string): Promise<number>;
}
