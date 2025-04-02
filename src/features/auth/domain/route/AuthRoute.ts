import { FastifyInstance } from 'fastify';
import { AuthService } from '../service/AuthService';
import { AuthController } from '../controller/AuthController';
import { zodToSwaggerSchema } from '@core/utils/zodToSwagger';

/**
 * Définit les routes d'authentification de l'application
 * @param app Instance Fastify
 * @param authService Service d'authentification
 */
export async function registerAuthRoutes(
  app: FastifyInstance,
  authService: AuthService
) {
  app.post(
    '/auth/register',
    {
      schema: {
        body: zodToSwaggerSchema('RegisterRequest'),
        tags: ['Auth'],
        summary: 'Créer un utilisateur',
        response: {
          201: {
            description: 'Utilisateur créé avec succès',
            type: 'object',
            properties: {
              id: { type: 'string' },
              username: { type: 'string' },
              email: { type: 'string' },
              roles: { type: 'array', items: { type: 'string' } },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      preHandler: [app.authenticate, app.authorize(['SUPER_ADMIN', 'ADMIN'])],
    },
    async (req, res) => AuthController.register(req as any, res, authService)
  );

  app.post(
    '/auth/set-password',
    {
      schema: {
        body: zodToSwaggerSchema('SetPasswordRequest'),
        tags: ['Auth'],
        summary: 'Définir le mot de passe via lien reçu par mail',
        response: {
          200: {
            description: 'Mot de passe défini',
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (req, res) => AuthController.setPassword(req as any, res, authService)
  );

  app.post(
    '/auth/login',
    {
      schema: {
        body: zodToSwaggerSchema('LoginRequest'),
        tags: ['Auth'],
        summary: 'Connexion utilisateur (username/email + password)',
        response: {
          200: {
            description: 'Connexion réussie',
            type: 'object',
            properties: {
              access_token: { type: 'string' },
              expire_date: { type: 'string', format: 'date-time' },
              refresh_token: { type: 'string' },
              refresh_expire_date: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (req, res) => AuthController.login(req as any, res, authService)
  );

  app.post(
    '/auth/refresh-token',
    {
      schema: {
        body: zodToSwaggerSchema('RefreshTokenRequest'),
        tags: ['Auth'],
        summary: 'Rafraîchir un access token expiré',
        response: {
          200: {
            description: 'Nouveaux tokens générés',
            type: 'object',
            properties: {
              access_token: { type: 'string' },
              expire_date: { type: 'string', format: 'date-time' },
              refresh_token: { type: 'string' },
              refresh_expire_date: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (req, res) =>
      AuthController.refreshToken(req as any, res, authService)
  );

  app.post(
    '/auth/forgot-password',
    {
      schema: {
        body: zodToSwaggerSchema('ForgotPasswordRequest'),
        tags: ['Auth'],
        summary: 'Envoyer un lien de réinitialisation de mot de passe',
      },
    },
    async (req, res) =>
      AuthController.forgotPassword(req as any, res, authService)
  );

  app.post(
    '/auth/reset-password',
    {
      schema: {
        body: zodToSwaggerSchema('ResetPasswordRequest'),
        tags: ['Auth'],
        summary: 'Réinitialiser le mot de passe avec un token',
      },
    },
    async (req, res) =>
      AuthController.resetPassword(req as any, res, authService)
  );

  app.post(
    '/auth/change-password',
    {
      schema: {
        body: zodToSwaggerSchema('ChangePasswordRequest'),
        tags: ['Auth'],
        summary: 'Changer son mot de passe (sans ancien mot de passe)',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      AuthController.changePassword(req as any, res, authService)
  );

  app.get(
    '/auth/me',
    {
      schema: {
        tags: ['Auth'],
        summary: 'Récupérer le profil utilisateur connecté',
        response: {
          200: {
            description: 'Profil utilisateur',
            type: 'object',
            properties: {
              id: { type: 'string' },
              username: { type: 'string' },
              email: { type: 'string' },
              firstname: { type: 'string' },
              lastname: { type: 'string' },
              phone: { type: 'string' },
              address: { type: 'string' },
              roles: { type: 'array', items: { type: 'string' } },
              status: { type: 'string' },
              emailVerified: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      preHandler: [app.authenticate],
    },
    async (req, res) => AuthController.getProfile(req, res, authService)
  );

  app.post(
    '/resend-first-login',
    {
      schema: {
        body: zodToSwaggerSchema('ResendFirstLoginEmailRequest'),
        tags: ['User'],
        summary:
          'Renvoyer le mail de définition du mot de passe à un utilisateur',
      },
      preHandler: [app.authenticate, app.authorize(['SUPER_ADMIN', 'ADMIN'])],
    },
    async (req, res) =>
      AuthController.resendFirstLoginEmail(req as any, res, authService)
  );
}
