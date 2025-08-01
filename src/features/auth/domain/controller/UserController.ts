import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../service/UserService';
import { UpdateUserRequest } from '@features/auth/presentation/payload/UpdateUserRequest';
import { ChangeUserStatusRequest } from '@features/auth/presentation/payload/ChangeUserStatusRequest';
import { AddRoleRequest } from '@features/auth/presentation/payload/AddRoleRequest';
import { DeleteAccountRequest } from '@features/auth/presentation/payload/DeleteAccountRequest';
import { UserListRequest } from '@features/auth/presentation/payload/UserListRequest';
import { AdminUpdateUserRequest } from '@features/auth/presentation/payload/AdminUpdateUserRequest';
import { logger } from '@core/config/logger';

export class UserController {
  /**
   * Récupère tous les utilisateurs (admin only)
   */
  static async getAll(
    req: FastifyRequest,
    res: FastifyReply,
    userService: UserService
  ) {
    const result = await userService.getPaginatedUsers(
      req.query as UserListRequest
    );
    res.send(result);
  }

  /**
   * Récupère un utilisateur par son ID
   */
  static async getById(
    req: FastifyRequest<{ Params: { id: string } }>,
    res: FastifyReply,
    userService: UserService
  ) {
    const user = await userService.getUserById(req.params.id);
    res.send(user);
  }

  /**
   * Mise à jour de son propre profil
   */
  static async updateProfile(
    req: FastifyRequest<{ Body: UpdateUserRequest }>,
    res: FastifyReply,
    userService: UserService
  ) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).send({ message: 'Non authentifié' });

    const updated = await userService.updateUserProfile(userId, req.body);
    res.send(updated);
  }

  /**
   * Admin : modifier les informations d'un utilisateur
   */
  static async adminUpdateUser(
    req: FastifyRequest<{
      Params: { id: string };
      Body: AdminUpdateUserRequest;
    }>,
    res: FastifyReply,
    userService: UserService
  ) {
    const updated = await userService.adminUpdateUser(req.params.id, req.body);
    res.send(updated);
  }

  /**
   * Changer le statut d’un utilisateur
   */
  static async changeStatus(
    req: FastifyRequest<{
      Params: { id: string };
      Body: ChangeUserStatusRequest;
    }>,
    res: FastifyReply,
    userService: UserService
  ) {
    await userService.changeStatus(req.params.id, req.body);
    res.send({ message: 'Statut mis à jour.' });
  }

  /**
   * Ajouter un rôle à un utilisateur
   */
  static async addRole(
    req: FastifyRequest<{ Params: { id: string }; Body: AddRoleRequest }>,
    res: FastifyReply,
    userService: UserService
  ) {
    logger.info(`Body ${req.body}`);
    const updated = await userService.addRole(req.params.id, req.body);
    res.send(updated);
  }

  /**
   * Demande de suppression de compte par un utilisateur
   */
  static async requestDeleteAccount(
    req: FastifyRequest<{ Body: DeleteAccountRequest }>,
    res: FastifyReply,
    userService: UserService
  ) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).send({ message: 'Non authentifié' });

    await userService.requestDeleteAccount(userId, req.body);
    res.send({ message: 'Demande de suppression envoyée au Super Admin.' });
  }
}
