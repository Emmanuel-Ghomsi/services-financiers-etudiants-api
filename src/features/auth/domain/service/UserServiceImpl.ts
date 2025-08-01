/* eslint-disable no-unused-vars */
import { UserDAO } from '@features/auth/data/dao/UserDAO';
import { UserService } from './UserService';
import { UserDTO } from '@features/auth/presentation/dto/UserDTO';
import { UpdateUserRequest } from '@features/auth/presentation/payload/UpdateUserRequest';
import { ChangeUserStatusRequest } from '@features/auth/presentation/payload/ChangeUserStatusRequest';
import { AddRoleRequest } from '@features/auth/presentation/payload/AddRoleRequest';
import { DeleteAccountRequest } from '@features/auth/presentation/payload/DeleteAccountRequest';
import { toUserDTO } from '@features/auth/presentation/mapper/UserMapper';
import {
  sendAccountDeletionRequestEmail,
  sendFirstLoginEmail,
} from '@infrastructure/mail/MailProvider';
import { UserListRequest } from '@features/auth/presentation/payload/UserListRequest';
import { PaginatedResult } from '@core/base/PaginatedResult';
import { AdminUpdateUserRequest } from '@features/auth/presentation/payload/AdminUpdateUserRequest';
import { RoleEnum } from '@prisma/client';

export class UserServiceImpl implements UserService {
  constructor(private readonly userDAO: UserDAO) {}

  async getPaginatedUsers(
    request: UserListRequest
  ): Promise<PaginatedResult<UserDTO>> {
    const { page, pageSize, filters } = request;
    const skip = (page - 1) * pageSize;

    const where = {
      AND: [
        { deletedAt: null },
        filters?.username
          ? { username: { contains: filters.username, mode: 'insensitive' } }
          : {},
        filters?.email
          ? { email: { contains: filters.email, mode: 'insensitive' } }
          : {},
      ],
    };

    const [items, totalItems] = await Promise.all([
      this.userDAO.findPaginated({ skip, take: pageSize, where }),
      this.userDAO.count(where),
    ]);

    return {
      items: items.map(toUserDTO),
      currentPage: page,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      pageSize,
      pageLimit: pageSize,
    };
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
    data: AdminUpdateUserRequest
  ): Promise<UserDTO> {
    const updatedUserEntity = await this.userDAO.adminUpdateUser(userId, data);

    // Envoi du mail de première connexion
    await sendFirstLoginEmail(
      updatedUserEntity.email,
      updatedUserEntity.firstLoginToken!
    );

    return toUserDTO(updatedUserEntity);
  }

  async changeStatus(
    userId: string,
    data: ChangeUserStatusRequest
  ): Promise<void> {
    await this.userDAO.updateStatus(userId, data.status);
  }

  async addRole(userId: string, data: AddRoleRequest): Promise<UserDTO> {
    // Récupérer les rôles actuels de l'utilisateur
    const user = await this.userDAO.findById(userId);
    const currentRoles = user?.roles.map((r) => r) || [];

    const requestedRoles = data.roles;
    const rolesToAdd = requestedRoles.filter(
      (role) => !currentRoles.includes(role)
    );
    const rolesToRemove = currentRoles.filter(
      (role) => !requestedRoles.includes(role as RoleEnum)
    );

    // Ajouter les nouveaux rôles
    for (const role of rolesToAdd) {
      await this.userDAO.addRoleToUser(userId, role);
    }

    // Supprimer les anciens rôles non souhaités
    if (rolesToRemove.length > 0) {
      await this.userDAO.removeRolesFromUser(userId, rolesToRemove);
    }

    // Retourner l’utilisateur mis à jour
    const updated = await this.userDAO.findById(userId);
    return toUserDTO(updated!);
  }

  async requestDeleteAccount(
    userId: string,
    data: DeleteAccountRequest
  ): Promise<void> {
    await this.userDAO.updateStatus(userId, 'PENDING_DELETION');
    await sendAccountDeletionRequestEmail(userId, data.reason);
  }
}
