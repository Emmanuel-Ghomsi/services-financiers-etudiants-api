/* eslint-disable no-unused-vars */
import { RegisterRequest } from '../../presentation/request/RegisterRequest';
import { UserEntity } from '../../data/entity/UserEntity';
import { SetPasswordRequest } from '@features/auth/presentation/request/SetPasswordRequest';
import { LoginRequest } from '@features/auth/presentation/request/LoginRequest';
import { LoginResponseDTO } from '@features/auth/presentation/dto/LoginResponseDTO';
import { RefreshTokenRequest } from '@features/auth/presentation/request/RefreshTokenRequest';
import { RefreshTokenResponseDTO } from '@features/auth/presentation/dto/RefreshTokenResponseDTO';
import { ForgotPasswordRequest } from '@features/auth/presentation/request/ForgotPasswordRequest';
import { ResetPasswordRequest } from '@features/auth/presentation/request/ResetPasswordRequest';
import { ChangePasswordRequest } from '@features/auth/presentation/request/ChangePasswordRequest';
import { UserDTO } from '@features/auth/presentation/dto/UserDTO';

/**
 * Interface du service d'authentification
 */
export interface AuthService {
  register(data: RegisterRequest): Promise<UserEntity>;
  setPassword(data: SetPasswordRequest): Promise<void>;
  login(data: LoginRequest): Promise<LoginResponseDTO>;
  refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponseDTO>;
  forgotPassword(data: ForgotPasswordRequest): Promise<void>;
  resetPassword(data: ResetPasswordRequest): Promise<void>;
  changePassword(userId: string, data: ChangePasswordRequest): Promise<void>;
  getProfile(userId: string): Promise<UserDTO>;
}
