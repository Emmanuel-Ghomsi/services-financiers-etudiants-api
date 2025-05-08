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
import { SendClientFilePdfByEmailRequestSchema } from '@features/clientFile/presentation/payload/SendClientFilePdfByEmailRequest';
import { UpdateClientFileStatusRequestSchema } from '@features/clientFile/presentation/payload/UpdateClientFileStatusRequest';
import { GetMediaRequestSchema } from '@features/media/presentation/payload/GetMediaRequest';
import { UpdateProfilePictureRequestSchema } from '@features/media/presentation/payload/UpdateProfilePictureRequest';
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
  SendClientFilePdfByEmailRequest: SendClientFilePdfByEmailRequestSchema,

  // Media
  UpdateProfilePictureRequest: UpdateProfilePictureRequestSchema,
  GetMediaRequest: GetMediaRequestSchema,
};
