import { FastifyRequest, FastifyReply } from 'fastify';

/**
 * Middleware pour autoriser un utilisateur à accéder à une route selon son rôle
 * @param roles Liste des rôles autorisés
 */
export function authorize(roles: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const user = request.user;

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return reply.status(403).send({ message: 'Accès interdit' });
    }

    const hasAccess = user.roles.some((role: string) => roles.includes(role));
    if (!hasAccess) {
      return reply
        .status(403)
        .send({ message: 'Accès refusé : rôle insuffisant' });
    }
  };
}
