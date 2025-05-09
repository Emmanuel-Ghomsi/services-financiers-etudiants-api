export interface DashboardSuperAdminDAO {
  getTotalUsers(): Promise<number>;
  getTotalAdvisors(): Promise<number>;
  getTotalAdmins(): Promise<number>;
  getPendingSuperAdminValidations(): Promise<number>;
  getTotalValidatedFiles(): Promise<number>;
}
