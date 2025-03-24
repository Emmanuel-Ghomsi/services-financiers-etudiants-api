// routes.ts
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { UserDAOImpl } from './features/auth/data/dao/UserDAOImpl';
import { AuthServiceImpl } from './features/auth/domain/service/AuthServiceImpl';
import { registerAuthRoutes } from '@features/auth/domain/route/AuthRoute';
import { config } from '@core/config/env';

export const registerRoutes = async (app: FastifyInstance) => {
  const prisma = new PrismaClient();
  const userDAO = new UserDAOImpl(prisma);
  const authService = new AuthServiceImpl(userDAO);

  app.register(
    async (router) => {
      await registerAuthRoutes(router, authService);
    },
    { prefix: `/${config.server.prefix}/auth` }
  );
};
