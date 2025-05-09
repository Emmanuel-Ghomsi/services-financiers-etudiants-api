/* eslint-disable no-unused-vars */
import { PaginatedResult } from '@core/base/PaginatedResult';
import { UserDTO } from '@features/auth/presentation/dto/UserDTO';
import { AddRoleRequest } from '@features/auth/presentation/payload/AddRoleRequest';
import { AdminUpdateUserRequest } from '@features/auth/presentation/payload/AdminUpdateUserRequest';
import { ChangeUserStatusRequest } from '@features/auth/presentation/payload/ChangeUserStatusRequest';
import { DeleteAccountRequest } from '@features/auth/presentation/payload/DeleteAccountRequest';
import { UpdateUserRequest } from '@features/auth/presentation/payload/UpdateUserRequest';
import { UserListRequest } from '@features/auth/presentation/payload/UserListRequest';

export interface UserService {
  getPaginatedUsers(
    request: UserListRequest
  ): Promise<PaginatedResult<UserDTO>>;
  getUserById(id: string): Promise<UserDTO>;
  updateUserProfile(userId: string, data: UpdateUserRequest): Promise<UserDTO>;
  adminUpdateUser(
    userId: string,
    data: AdminUpdateUserRequest
  ): Promise<UserDTO>;
  changeStatus(userId: string, data: ChangeUserStatusRequest): Promise<void>;
  addRole(userId: string, data: AddRoleRequest): Promise<UserDTO>;
  requestDeleteAccount(
    userId: string,
    data: DeleteAccountRequest
  ): Promise<void>;
}
