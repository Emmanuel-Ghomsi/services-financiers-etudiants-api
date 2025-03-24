/* eslint-disable no-unused-vars */
import { AuthService } from './AuthService';
import { RegisterRequest } from '../../presentation/request/RegisterRequest';
import { UserEntity } from '../../data/entity/UserEntity';
import { UserDAO } from '../../data/dao/UserDAO';
import { v4 as uuidv4 } from 'uuid';
import {
  sendFirstLoginEmail,
  sendResetPasswordEmail,
} from '@infrastructure/mail/MailProvider';
import { SetPasswordRequest } from '@features/auth/presentation/request/SetPasswordRequest';
import bcrypt from 'bcrypt';
import { ValidationException } from '@core/exceptions/ValidationException';
import jwt from 'jsonwebtoken';
import { LoginRequest } from '@features/auth/presentation/request/LoginRequest';
import { LoginResponseDTO } from '@features/auth/presentation/dto/LoginResponseDTO';
import { RefreshTokenRequest } from '@features/auth/presentation/request/RefreshTokenRequest';
import { RefreshTokenResponseDTO } from '@features/auth/presentation/dto/RefreshTokenResponseDTO';
import { ForgotPasswordRequest } from '@features/auth/presentation/request/ForgotPasswordRequest';
import { ResetPasswordRequest } from '@features/auth/presentation/request/ResetPasswordRequest';
import { ChangePasswordRequest } from '@features/auth/presentation/request/ChangePasswordRequest';
import { toUserDTO } from '@features/auth/presentation/mapper/UserMapper';
import { UserDTO } from '@features/auth/presentation/dto/UserDTO';
import { config } from '@core/config/env';

/**
 * Implémentation du service d'authentification
 */
export class AuthServiceImpl implements AuthService {
  constructor(private readonly userDAO: UserDAO) {}

  async register(data: RegisterRequest): Promise<UserEntity> {
    const firstLoginToken = uuidv4();
    const firstLoginExpiry = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48h

    const newUser = await this.userDAO.createUser({
      ...data,
      firstLoginToken,
      firstLoginExpiry,
    });

    await sendFirstLoginEmail(newUser.email, firstLoginToken); // lien de définition de mot de passe

    return newUser;
  }

  async setPassword(data: SetPasswordRequest): Promise<void> {
    const user = await this.userDAO.findByFirstLoginToken(data.token);

    if (!user) {
      throw new ValidationException('Token invalide');
    }

    if (!user.firstLoginExpiry || user.firstLoginExpiry < new Date()) {
      throw new ValidationException('Lien expiré');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.userDAO.setPasswordAndClearToken(user.id, hashedPassword);
  }

  async login(data: LoginRequest): Promise<LoginResponseDTO> {
    const user = await this.userDAO.findByUsernameOrEmail(data.username);
    if (!user || !user.password) {
      throw new Error('Identifiants invalides');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error('Identifiants invalides');

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };

    const expiresIn = 60 * 60; // 1h
    const access_token = jwt.sign(payload, config.jwt.secret, {
      expiresIn,
    });

    const refresh_token = uuidv4();
    const refresh_expire_date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 jours

    await this.userDAO.saveRefreshToken(
      user.id,
      refresh_token,
      refresh_expire_date
    );

    return {
      access_token,
      expire_date: new Date(Date.now() + 1000 * expiresIn),
      refresh_token,
      refresh_expire_date,
    };
  }

  async refreshToken(
    data: RefreshTokenRequest
  ): Promise<RefreshTokenResponseDTO> {
    const tokenRecord = await this.userDAO.findRefreshToken(data.refresh_token);

    if (!tokenRecord) {
      throw new Error('Refresh token invalide');
    }

    if (tokenRecord.revoked || tokenRecord.expiresAt < new Date()) {
      throw new Error('Refresh token expiré');
    }

    const user = await this.userDAO.findById(tokenRecord.userId);
    if (!user) throw new Error('Utilisateur introuvable');

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };

    const expiresIn = 60 * 60;
    const access_token = jwt.sign(payload, config.jwt.secret, {
      expiresIn,
    });
    const new_refresh_token = uuidv4();
    const new_refresh_expire_date = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7
    );

    // Révoquer l'ancien
    await this.userDAO.revokeRefreshToken(tokenRecord.token);
    await this.userDAO.saveRefreshToken(
      user.id,
      new_refresh_token,
      new_refresh_expire_date
    );

    return {
      access_token,
      expire_date: new Date(Date.now() + 1000 * expiresIn),
      refresh_token: new_refresh_token,
      refresh_expire_date: new_refresh_expire_date,
    };
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    const user = await this.userDAO.findByEmail(data.email);
    if (!user) return; // pas d'erreur pour éviter enumeration

    const token = uuidv4();
    const expiry = new Date(Date.now() + 1000 * 60 * 60 * 1); // 1h

    await this.userDAO.setResetToken(user.id, token, expiry);
    await sendResetPasswordEmail(user.email, token);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const user = await this.userDAO.findByResetToken(data.token);
    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new Error('Lien expiré ou invalide');
    }

    const hashed = await bcrypt.hash(data.password, 10);
    await this.userDAO.setPasswordAndClearResetToken(user.id, hashed);
  }

  async changePassword(
    userId: string,
    data: ChangePasswordRequest
  ): Promise<void> {
    const hashed = await bcrypt.hash(data.newPassword, 10);
    await this.userDAO.updatePassword(userId, hashed);
  }

  async getProfile(userId: string): Promise<UserDTO> {
    const user = await this.userDAO.findById(userId);
    if (!user) throw new Error('Utilisateur introuvable');

    return toUserDTO(user);
  }
}
