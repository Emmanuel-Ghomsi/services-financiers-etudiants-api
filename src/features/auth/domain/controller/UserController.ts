import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../service/UserService';
import { UpdateUserRequest } from '@features/auth/presentation/request/UpdateUserRequest';
import { ChangeUserStatusRequest } from '@features/auth/presentation/request/ChangeUserStatusRequest';
import { AddRoleRequest } from '@features/auth/presentation/request/AddRoleRequest';
import { DeleteAccountRequest } from '@features/auth/presentation/request/DeleteAccountRequest';

export class UserController {
  /**
   * Récupère tous les utilisateurs (admin only)
   */
  static async getAll(
    req: FastifyRequest,
    res: FastifyReply,
    userService: UserService
  ) {
    const users = await userService.getAllUsers();
    res.send(users);
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
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateUserRequest }>,
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
