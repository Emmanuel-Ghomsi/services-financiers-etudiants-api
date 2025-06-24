/* eslint-disable no-unused-vars */
import { UserEntity } from '../entity/UserEntity';
import { RegisterRequest } from '../../presentation/payload/RegisterRequest';
import { AdminUpdateUserRequest } from '@features/auth/presentation/payload/AdminUpdateUserRequest';

export interface UserDAO {
  createUser(
    data: RegisterRequest & {
      firstLoginToken: string;
      firstLoginExpiry: Date;
    }
  ): Promise<UserEntity>;
  findByFirstLoginToken(token: string): Promise<UserEntity | null>;
  setPasswordAndClearToken(userId: string, password: string): Promise<void>;
  findByUsernameOrEmail(usernameOrEmail: string): Promise<UserEntity | null>;
  saveRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<void>;
  findRefreshToken(token: string): Promise<{
    token: string;
    userId: string;
    expiresAt: Date;
    revoked: boolean;
  } | null>;
  revokeRefreshToken(token: string): Promise<void>;
  findById(userId: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByResetToken(token: string): Promise<UserEntity | null>;
  setResetToken(userId: string, token: string, expiry: Date): Promise<void>;
  setPasswordAndClearResetToken(
    userId: string,
    password: string
  ): Promise<void>;
  updatePassword(userId: string, newHashedPassword: string): Promise<void>;
  findPaginated(params: {
    skip: number;
    take: number;
    where: any;
  }): Promise<UserEntity[]>;
  count(where: any): Promise<number>;
  updateUser(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
  softDeleteUser(id: string): Promise<void>;
  updateStatus(id: string, status: string): Promise<void>;
  addRoleToUser(userId: string, roleName: string): Promise<UserEntity>;
  updateProfilePicture(userId: string, url: string): Promise<void>;
  findAllByRoles(roles: string[]): Promise<UserEntity[]>;
  resendFirstLoginToken(email: string): Promise<UserEntity | null>;
  adminUpdateUser(
    userId: string,
    data: AdminUpdateUserRequest
  ): Promise<UserEntity>;
  updateProfilePicture(
    userId: string,
    profilePicturePath: string
  ): Promise<void>;
  removeRolesFromUser(userId: string, rolesToRemove: string[]): Promise<void>;
}
