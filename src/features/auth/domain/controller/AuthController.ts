import { FastifyReply, FastifyRequest } from 'fastify';
import { RegisterRequest } from '../../presentation/request/RegisterRequest';
import { AuthService } from '../service/AuthService';
import { toUserDTO } from '../../presentation/mapper/UserMapper';
import { SetPasswordRequest } from '@features/auth/presentation/request/SetPasswordRequest';
import { LoginRequest } from '@features/auth/presentation/request/LoginRequest';
import { RefreshTokenRequest } from '@features/auth/presentation/request/RefreshTokenRequest';
import { ForgotPasswordRequest } from '@features/auth/presentation/request/ForgotPasswordRequest';
import { ResetPasswordRequest } from '@features/auth/presentation/request/ResetPasswordRequest';
import { ChangePasswordRequest } from '@features/auth/presentation/request/ChangePasswordRequest';

/**
 * Contrôleur d'authentification (statique uniquement)
 */
export class AuthController {
  static async register(
    request: FastifyRequest<{ Body: RegisterRequest }>,
    reply: FastifyReply,
    authService: AuthService
  ): Promise<void> {
    const registerRequest = request.body;
    const createdUser = await authService.register(registerRequest);
    reply.code(201).send(toUserDTO(createdUser));
  }

  static async setPassword(
    request: FastifyRequest<{ Body: SetPasswordRequest }>,
    reply: FastifyReply,
    authService: AuthService
  ): Promise<void> {
    const data = request.body;
    await authService.setPassword(data);
    reply.code(200).send({ message: 'Mot de passe défini avec succès' });
  }

  static async login(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply,
    authService: AuthService
  ) {
    const response = await authService.login(request.body);
    return reply.send(response);
  }

  static async refreshToken(
    request: FastifyRequest<{ Body: RefreshTokenRequest }>,
    reply: FastifyReply,
    authService: AuthService
  ) {
    const data = request.body;
    const response = await authService.refreshToken(data);
    return reply.send(response);
  }

  static async forgotPassword(
    req: FastifyRequest<{ Body: ForgotPasswordRequest }>,
    reply: FastifyReply,
    authService: AuthService
  ) {
    await authService.forgotPassword(req.body);
    reply.send({
      message: 'Si l’email existe, un lien de réinitialisation a été envoyé.',
    });
  }

  static async resetPassword(
    req: FastifyRequest<{ Body: ResetPasswordRequest }>,
    reply: FastifyReply,
    authService: AuthService
  ) {
    await authService.resetPassword(req.body);
    reply.send({ message: 'Mot de passe mis à jour avec succès.' });
  }

  static async changePassword(
    req: FastifyRequest<{ Body: ChangePasswordRequest }>,
    reply: FastifyReply,
    authService: AuthService
  ) {
    const userId = req.user?.id;
    if (!userId) return reply.status(401).send({ message: 'Non authentifié' });

    await authService.changePassword(userId, req.body);
    reply.send({ message: 'Mot de passe modifié avec succès.' });
  }

  static async getProfile(
    req: FastifyRequest,
    reply: FastifyReply,
    authService: AuthService
  ) {
    const userId = req.user?.id;
    if (!userId) return reply.status(401).send({ message: 'Non authentifié' });

    const profile = await authService.getProfile(userId);
    return reply.send(profile);
  }
}
