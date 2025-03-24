/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from '@core/config/env';
import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = config.jwt.secret;

/**
 * Middleware pour vérifier l'authentification de l'utilisateur via JWT
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ message: 'Token manquant ou invalide' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);

    // On attache l'utilisateur à la requête pour l'utiliser plus tard
    request.user = payload;
  } catch (error) {
    return reply.status(401).send({ message: 'Token invalide ou expiré' });
  }
}
