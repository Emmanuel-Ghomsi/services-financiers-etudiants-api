import { FastifyInstance } from 'fastify';
import { UserService } from '../service/UserService';
import { UserController } from '../controller/UserController';
import { zodToSwaggerSchema } from '@core/utils/zodToSwagger';

/**
 * Routes pour la gestion des utilisateurs
 * @param app Instance Fastify
 * @param userService Instance du service User
 */
export async function registerUserRoutes(
  app: FastifyInstance,
  userService: UserService
) {
  // 👥 Liste de tous les utilisateurs (admin/superadmin)
  app.get(
    '/user',
    {
      schema: {
        querystring: zodToSwaggerSchema('UserListRequest'),
        tags: ['User'],
        summary: 'Récupérer les utilisateurs avec pagination et filtre',
      },
      preHandler: [app.authenticate, app.authorize(['SUPER_ADMIN', 'ADMIN'])],
    },
    async (req, res) => UserController.getAll(req, res, userService)
  );

  // 🔎 Obtenir un utilisateur par ID
  app.get(
    '/user/:id',
    {
      schema: {
        tags: ['User'],
        summary: 'Récupérer un utilisateur par ID',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) => UserController.getById(req as any, res, userService)
  );

  // ✏️ Mise à jour de son propre profil
  app.put(
    '/user/me',
    {
      schema: {
        body: zodToSwaggerSchema('UpdateUserRequest'),
        tags: ['User'],
        summary: 'Modifier ses propres informations',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      UserController.updateProfile(req as any, res, userService)
  );

  // 🛠️ Admin : modifier un utilisateur
  app.put(
    '/user/:id',
    {
      schema: {
        body: zodToSwaggerSchema('AdminUpdateUserRequest'),
        tags: ['User'],
        summary:
          'Modifier un utilisateur avant sa première connexion ou validation email',
      },
      preHandler: [app.authenticate, app.authorize(['SUPER_ADMIN', 'ADMIN'])],
    },
    async (req, res) =>
      UserController.adminUpdateUser(req as any, res, userService)
  );

  // 🚫 Modifier le statut (BLOCKED, ACTIVE, etc.)
  app.patch(
    '/user/:id/status',
    {
      schema: {
        body: zodToSwaggerSchema('ChangeUserStatusRequest'),
        tags: ['User'],
        summary: 'Changer le statut d’un utilisateur',
      },
      preHandler: [app.authenticate, app.authorize(['SUPER_ADMIN', 'ADMIN'])],
    },
    async (req, res) =>
      UserController.changeStatus(req as any, res, userService)
  );

  // ➕ Ajouter un rôle à un utilisateur
  app.patch(
    '/user/:id/role',
    {
      schema: {
        body: zodToSwaggerSchema('AddRoleRequest'),
        tags: ['User'],
        summary: 'Ajouter un rôle à un utilisateur',
      },
      preHandler: [app.authenticate, app.authorize(['SUPER_ADMIN', 'ADMIN'])],
    },
    async (req, res) => UserController.addRole(req as any, res, userService)
  );

  // ❌ Demande de suppression de compte
  app.post(
    '/user/me/delete',
    {
      schema: {
        body: zodToSwaggerSchema('DeleteAccountRequest'),
        tags: ['User'],
        summary: 'Demander la suppression de son compte',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      UserController.requestDeleteAccount(req as any, res, userService)
  );
}
