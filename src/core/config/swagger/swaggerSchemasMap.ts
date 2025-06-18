import { AddRoleRequestSchema } from '@features/auth/presentation/payload/AddRoleRequest';
import { AdminUpdateUserRequestSchema } from '@features/auth/presentation/payload/AdminUpdateUserRequest';
import { ChangePasswordRequestSchema } from '@features/auth/presentation/payload/ChangePasswordRequest';
import { ChangeUserStatusRequestSchema } from '@features/auth/presentation/payload/ChangeUserStatusRequest';
import { DeleteAccountRequestSchema } from '@features/auth/presentation/payload/DeleteAccountRequest';
import { ForgotPasswordRequestSchema } from '@features/auth/presentation/payload/ForgotPasswordRequest';
import { LoginRequestSchema } from '@features/auth/presentation/payload/LoginRequest';
import { RefreshTokenRequestSchema } from '@features/auth/presentation/payload/RefreshTokenRequest';
import { RegisterRequestSchema } from '@features/auth/presentation/payload/RegisterRequest';
import { ResendFirstLoginEmailRequestSchema } from '@features/auth/presentation/payload/ResendFirstLoginEmailRequest';
import { ResetPasswordRequestSchema } from '@features/auth/presentation/payload/ResetPasswordRequest';
import { SetPasswordRequestSchema } from '@features/auth/presentation/payload/SetPasswordRequest';
import { UpdateUserRequestSchema } from '@features/auth/presentation/payload/UpdateUserRequest';
import { UserListRequestSchema } from '@features/auth/presentation/payload/UserListRequest';
import { ClientFileActivityRequestSchema } from '@features/clientFile/presentation/payload/ClientFileActivityRequest';
import { ClientFileAddressRequestSchema } from '@features/clientFile/presentation/payload/ClientFileAddressRequest';
import { ClientFileComplianceRequestSchema } from '@features/clientFile/presentation/payload/ClientFileComplianceRequest';
import { ClientFileCreateRequestSchema } from '@features/clientFile/presentation/payload/ClientFileCreateRequest';
import { ClientFileFundOriginRequestSchema } from '@features/clientFile/presentation/payload/ClientFileFundOriginRequest';
import { ClientFileIdentityRequestSchema } from '@features/clientFile/presentation/payload/ClientFileIdentityRequest';
import { ClientFileInternationalRequestSchema } from '@features/clientFile/presentation/payload/ClientFileInternationalRequest';
import { ClientFileListRequestSchema } from '@features/clientFile/presentation/payload/ClientFileListRequest';
import { ClientFileOperationRequestSchema } from '@features/clientFile/presentation/payload/ClientFileOperationRequest';
import { ClientFilePepRequestSchema } from '@features/clientFile/presentation/payload/ClientFilePepRequest';
import { ClientFileServicesRequestSchema } from '@features/clientFile/presentation/payload/ClientFileServicesRequest';
import { ClientFileSituationRequestSchema } from '@features/clientFile/presentation/payload/ClientFileSituationRequest';
import { UpdateClientFileStatusRequestSchema } from '@features/clientFile/presentation/payload/UpdateClientFileStatusRequest';
import { CreateExpenseRequestSchema } from '@features/expense/presentation/payload/CreateExpenseRequest';
import { ExpenseListRequestSchema } from '@features/expense/presentation/payload/ExpenseListRequest';
import { UpdateExpenseRequestSchema } from '@features/expense/presentation/payload/UpdateExpenseRequest';
import { GetMediaRequestSchema } from '@features/media/presentation/payload/GetMediaRequest';
import { UpdateProfilePictureRequestSchema } from '@features/media/presentation/payload/UpdateProfilePictureRequest';
import { CreateSalaryRequestSchema } from '@features/salary/presentation/payload/CreateSalaryRequest';
import { UpdateSalaryRequestSchema } from '@features/salary/presentation/payload/UpdateSalaryRequest';
import { SalaryListRequestSchema } from '@features/salary/presentation/payload/SalaryListRequest';
import { CreateLeaveRequestSchema } from '@features/leave/presentation/payload/CreateLeaveRequest';
import { UpdateLeaveRequestSchema } from '@features/leave/presentation/payload/UpdateLeaveRequest';
import { LeaveListRequestSchema } from '@features/leave/presentation/payload/LeaveListRequest';

import { z } from 'zod';
import { SalaryPeriodFilterRequestSchema } from '@features/salary/presentation/payload/SalaryPeriodFilterRequest';
import { SalaryPeriodPaginatedRequestSchema } from '@features/salary/presentation/payload/SalaryPeriodPaginatedRequest';
import { ExpenseFilterRequestSchema } from '@features/expense/presentation/payload/ExpenseFilterRequest';
import { ExpenseStatsRequestSchema } from '@features/expense/presentation/payload/ExpenseStatsRequest';
import { LeaveStatsRequestSchema } from '@features/leave/presentation/payload/LeaveStatsRequest';
import { LeaveBalanceRequestSchema } from '@features/leave/presentation/payload/LeaveBalanceRequest';
import { UpdateSalaryAdvanceStatusRequestSchema } from '@features/salary/presentation/payload/UpdateSalaryAdvanceStatusRequest';
import { CreateSalaryAdvanceRequestSchema } from '@features/salary/presentation/payload/CreateSalaryAdvanceRequest';
import { ExpenseDTOSchema } from '@features/expense/presentation/dto/ExpenseDTO';
import { ExpensePaginationDTOSchema } from '@features/expense/presentation/dto/ExpensePaginationDTO';
import { ExpenseStatsDTOSchema } from '@features/expense/presentation/dto/ExpenseStatsDTO';
import { SalaryAdvanceDTOSchema } from '@features/salary/presentation/dto/SalaryAdvanceDTO';
import { SalaryDTOSchema } from '@features/salary/presentation/dto/SalaryDTO';
import { SalaryPaginationDTOSchema } from '@features/salary/presentation/dto/SalaryPaginationDTO';
import { SalaryPdfDataDTOSchema } from '@features/salary/presentation/dto/SalaryPdfDataDTO';
import { SalaryPeriodDTOSchema } from '@features/salary/presentation/dto/SalaryPeriodDTO';
import { SalaryPeriodPaginationDTOSchema } from '@features/salary/presentation/dto/SalaryPeriodPaginationDTO';
import { LeaveBalanceDTOSchema } from '@features/leave/presentation/dto/LeaveBalanceDTO';
import { LeaveDTOSchema } from '@features/leave/presentation/dto/LeaveDTO';
import { LeavePaginationDTOSchema } from '@features/leave/presentation/dto/LeavePaginationDTO';
import { LeaveStatsDTOSchema } from '@features/leave/presentation/dto/LeaveStatsDTO';

export const swaggerSchemasMap: Record<string, z.ZodType> = {
  // 🔐 Auth
  RegisterRequest: RegisterRequestSchema,
  SetPasswordRequest: SetPasswordRequestSchema,
  LoginRequest: LoginRequestSchema,
  RefreshTokenRequest: RefreshTokenRequestSchema,
  ForgotPasswordRequest: ForgotPasswordRequestSchema,
  ResetPasswordRequest: ResetPasswordRequestSchema,
  ChangePasswordRequest: ChangePasswordRequestSchema,
  ResendFirstLoginEmailRequest: ResendFirstLoginEmailRequestSchema,

  // 👤 User
  UpdateUserRequest: UpdateUserRequestSchema,
  ChangeUserStatusRequest: ChangeUserStatusRequestSchema,
  AddRoleRequest: AddRoleRequestSchema,
  DeleteAccountRequest: DeleteAccountRequestSchema,
  UserListRequest: UserListRequestSchema,
  AdminUpdateUserRequest: AdminUpdateUserRequestSchema,

  // 📄 ClientFile
  ClientFileCreateRequest: ClientFileCreateRequestSchema,
  ClientFileIdentityRequest: ClientFileIdentityRequestSchema,
  ClientFileAddressRequest: ClientFileAddressRequestSchema,
  ClientFileActivityRequest: ClientFileActivityRequestSchema,
  ClientFileSituationRequest: ClientFileSituationRequestSchema,
  ClientFileInternationalRequest: ClientFileInternationalRequestSchema,
  ClientFileServicesRequest: ClientFileServicesRequestSchema,
  ClientFileOperationRequest: ClientFileOperationRequestSchema,
  ClientFilePepRequest: ClientFilePepRequestSchema,
  ClientFileComplianceRequest: ClientFileComplianceRequestSchema,
  ClientFileFundOriginRequest: ClientFileFundOriginRequestSchema,
  ClientFileListRequest: ClientFileListRequestSchema,
  UpdateClientFileStatusRequest: UpdateClientFileStatusRequestSchema,

  // Media
  UpdateProfilePictureRequest: UpdateProfilePictureRequestSchema,
  GetMediaRequest: GetMediaRequestSchema,

  // Expense
  CreateExpenseRequest: CreateExpenseRequestSchema,
  UpdateExpenseRequest: UpdateExpenseRequestSchema,
  ExpenseListRequest: ExpenseListRequestSchema,
  ExpenseFilterRequest: ExpenseFilterRequestSchema,
  ExpenseStatsRequest: ExpenseStatsRequestSchema,
  ExpenseDTO: ExpenseDTOSchema,
  ExpensePaginationDTO: ExpensePaginationDTOSchema,
  ExpenseStatsDTO: ExpenseStatsDTOSchema,

  // Salary
  CreateSalaryRequest: CreateSalaryRequestSchema,
  UpdateSalaryRequest: UpdateSalaryRequestSchema,
  SalaryListRequest: SalaryListRequestSchema,
  SalaryPeriodFilterRequest: SalaryPeriodFilterRequestSchema,
  SalaryPeriodPaginatedRequest: SalaryPeriodPaginatedRequestSchema,
  UpdateSalaryAdvanceStatusRequest: UpdateSalaryAdvanceStatusRequestSchema,
  CreateSalaryAdvanceRequest: CreateSalaryAdvanceRequestSchema,
  SalaryAdvanceDTO: SalaryAdvanceDTOSchema,
  SalaryDTO: SalaryDTOSchema,
  SalaryPaginationDTO: SalaryPaginationDTOSchema,
  SalaryPdfDataDTO: SalaryPdfDataDTOSchema,
  SalaryPeriodDTO: SalaryPeriodDTOSchema,
  SalaryPeriodPaginationDTO: SalaryPeriodPaginationDTOSchema,

  // Leave
  CreateLeaveRequest: CreateLeaveRequestSchema,
  UpdateLeaveRequest: UpdateLeaveRequestSchema,
  LeaveListRequest: LeaveListRequestSchema,
  LeaveStatsRequest: LeaveStatsRequestSchema,
  LeaveBalanceRequest: LeaveBalanceRequestSchema,
  LeaveBalanceDTO: LeaveBalanceDTOSchema,
  LeaveDTO: LeaveDTOSchema,
  LeavePaginationDTO: LeavePaginationDTOSchema,
  LeaveStatsDTO: LeaveStatsDTOSchema,
};
