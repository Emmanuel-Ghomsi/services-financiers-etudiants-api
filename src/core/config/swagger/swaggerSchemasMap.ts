import { AddRoleRequestSchema } from '@features/auth/presentation/request/AddRoleRequest';
import { ChangePasswordRequestSchema } from '@features/auth/presentation/request/ChangePasswordRequest';
import { ChangeUserStatusRequestSchema } from '@features/auth/presentation/request/ChangeUserStatusRequest';
import { DeleteAccountRequestSchema } from '@features/auth/presentation/request/DeleteAccountRequest';
import { ForgotPasswordRequestSchema } from '@features/auth/presentation/request/ForgotPasswordRequest';
import { LoginRequestSchema } from '@features/auth/presentation/request/LoginRequest';
import { RefreshTokenRequestSchema } from '@features/auth/presentation/request/RefreshTokenRequest';
import { RegisterRequestSchema } from '@features/auth/presentation/request/RegisterRequest';
import { ResetPasswordRequestSchema } from '@features/auth/presentation/request/ResetPasswordRequest';
import { SetPasswordRequestSchema } from '@features/auth/presentation/request/SetPasswordRequest';
import { UpdateUserRequestSchema } from '@features/auth/presentation/request/UpdateUserRequest';
import { ClientFileActivityRequestSchema } from '@features/clientFile/presentation/request/ClientFileActivityRequest';
import { ClientFileAddressRequestSchema } from '@features/clientFile/presentation/request/ClientFileAddressRequest';
import { ClientFileComplianceRequestSchema } from '@features/clientFile/presentation/request/ClientFileComplianceRequest';
import { ClientFileCreateRequestSchema } from '@features/clientFile/presentation/request/ClientFileCreateRequest';
import { ClientFileFundOriginRequestSchema } from '@features/clientFile/presentation/request/ClientFileFundOriginRequest';
import { ClientFileIdentityRequestSchema } from '@features/clientFile/presentation/request/ClientFileIdentityRequest';
import { ClientFileInternationalRequestSchema } from '@features/clientFile/presentation/request/ClientFileInternationalRequest';
import { ClientFileListRequestSchema } from '@features/clientFile/presentation/request/ClientFileListRequest';
import { ClientFileOperationRequestSchema } from '@features/clientFile/presentation/request/ClientFileOperationRequest';
import { ClientFilePepRequestSchema } from '@features/clientFile/presentation/request/ClientFilePepRequest';
import { ClientFileServicesRequestSchema } from '@features/clientFile/presentation/request/ClientFileServicesRequest';
import { ClientFileSituationRequestSchema } from '@features/clientFile/presentation/request/ClientFileSituationRequest';
import { z } from 'zod';

export const swaggerSchemasMap: Record<string, z.ZodType> = {
  // 🔐 Auth
  RegisterRequest: RegisterRequestSchema,
  SetPasswordRequest: SetPasswordRequestSchema,
  LoginRequest: LoginRequestSchema,
  RefreshTokenRequest: RefreshTokenRequestSchema,
  ForgotPasswordRequest: ForgotPasswordRequestSchema,
  ResetPasswordRequest: ResetPasswordRequestSchema,
  ChangePasswordRequest: ChangePasswordRequestSchema,

  // 👤 User
  UpdateUserRequest: UpdateUserRequestSchema,
  ChangeUserStatusRequest: ChangeUserStatusRequestSchema,
  AddRoleRequest: AddRoleRequestSchema,
  DeleteAccountRequest: DeleteAccountRequestSchema,

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
};
