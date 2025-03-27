/* eslint-disable no-unused-vars */
import { UserDAO } from '@features/auth/data/dao/UserDAO';
import { UserService } from './UserService';
import { UserDTO } from '@features/auth/presentation/dto/UserDTO';
import { UpdateUserRequest } from '@features/auth/presentation/request/UpdateUserRequest';
import { ChangeUserStatusRequest } from '@features/auth/presentation/request/ChangeUserStatusRequest';
import { AddRoleRequest } from '@features/auth/presentation/request/AddRoleRequest';
import { DeleteAccountRequest } from '@features/auth/presentation/request/DeleteAccountRequest';
import { toUserDTO } from '@features/auth/presentation/mapper/UserMapper';
import { sendAccountDeletionRequestEmail } from '@infrastructure/mail/MailProvider';

export class UserServiceImpl implements UserService {
  constructor(private readonly userDAO: UserDAO) {}

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.userDAO.findAll();
    return users.map(toUserDTO);
  }

  async getUserById(id: string): Promise<UserDTO> {
    const user = await this.userDAO.findById(id);
    if (!user) throw new Error('Utilisateur introuvable');
    return toUserDTO(user);
  }

  async updateUserProfile(
    userId: string,
    data: UpdateUserRequest
  ): Promise<UserDTO> {
    const updated = await this.userDAO.updateUser(userId, data);
    return toUserDTO(updated);
  }

  async adminUpdateUser(
    userId: string,
    data: UpdateUserRequest
  ): Promise<UserDTO> {
    const updated = await this.userDAO.updateUser(userId, data);
    return toUserDTO(updated);
  }

  async changeStatus(
    userId: string,
    data: ChangeUserStatusRequest
  ): Promise<void> {
    await this.userDAO.updateStatus(userId, data.status);
  }

  async addRole(userId: string, data: AddRoleRequest): Promise<UserDTO> {
    const updated = await this.userDAO.addRoleToUser(userId, data.role);
    return toUserDTO(updated);
  }

  async requestDeleteAccount(
    userId: string,
    data: DeleteAccountRequest
  ): Promise<void> {
    await this.userDAO.updateStatus(userId, 'PENDING_DELETION');
    await sendAccountDeletionRequestEmail(userId, data.reason);
  }
}
