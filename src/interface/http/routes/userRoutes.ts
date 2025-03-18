import { FastifyInstance } from 'fastify';
import { authMiddleware, requireRole } from '../middlewares/authMiddleware';
import {
  loginHandler,
  loginSchema,
  registerHandler,
  registerSchema,
} from '../controllers/AuthController';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.post('/auth/register', { schema: registerSchema }, registerHandler);
  fastify.post('/auth/login', { schema: loginSchema }, loginHandler);

  fastify.register(async (securedRoutes) => {
    securedRoutes.addHook('preHandler', authMiddleware);

    securedRoutes.get(
      '/admin',
      { preHandler: requireRole('ADMIN') },
      async (req, reply) => {
        reply.send({ message: 'Bienvenue, Admin !' });
      }
    );
  });
}
