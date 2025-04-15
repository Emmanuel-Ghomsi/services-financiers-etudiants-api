// routes.ts
import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { UserDAOImpl } from './features/auth/data/dao/UserDAOImpl';
import { AuthServiceImpl } from './features/auth/domain/service/AuthServiceImpl';
import { registerAuthRoutes } from '@features/auth/domain/route/AuthRoute';
import { config } from '@core/config/env';
import { registerUserRoutes } from '@features/auth/domain/route/UserRoute';
import { UserServiceImpl } from '@features/auth/domain/service/UserServiceImpl';
import { ClientFileServiceImpl } from '@features/clientFile/domain/service/ClientFileServiceImpl';
import { ClientFileDAOImpl } from '@features/clientFile/data/dao/ClientFileDAOImpl';
import { NotificationService } from '@features/notification/domain/service/NotificationService';
import { NotificationDAOImpl } from '@features/notification/data/dao/NotificationDAOImpl';
import { registerClientFileRoutes } from '@features/clientFile/domain/route/ClientFileRoute';
import { registerNotificationRoutes } from '@features/notification/domain/route/NotificationRoute';
import { registerMediaRoutes } from '@features/media/domain/route/MediaRoute';
import { MediaServiceImpl } from '@features/media/domain/service/MediaServiceImpl';
import { MediaDAOImpl } from '@features/media/data/dao/MediaDAOImpl';
import { registerDashboardRoutes } from '@features/dashboard/domain/route/DashboardRoute';
import { DashboardServiceImpl } from '@features/dashboard/domain/service/DashboardServiceImpl';
import { DashboardSuperAdminDAOImpl } from '@features/dashboard/data/dao/DashboardSuperAdminDAOImpl';
import { DashboardAdminDAOImpl } from '@features/dashboard/data/dao/DashboardAdminDAOImpl';
import { DashboardAdvisorDAOImpl } from '@features/dashboard/data/dao/DashboardAdvisorDAOImpl';

export const registerRoutes = async (app: FastifyInstance) => {
  const prisma = new PrismaClient();
  const userDAO = new UserDAOImpl(prisma);
  const clientFileDAO = new ClientFileDAOImpl(prisma);
  const notificationDAO = new NotificationDAOImpl(prisma);
  const mediaDAO = new MediaDAOImpl();

  const authService = new AuthServiceImpl(userDAO);
  const userService = new UserServiceImpl(userDAO);
  const notificationService = new NotificationService(notificationDAO);
  const clientFileService = new ClientFileServiceImpl(
    clientFileDAO,
    userDAO,
    notificationService
  );
  const mediaService = new MediaServiceImpl(mediaDAO, userDAO);
  const dashboardService = new DashboardServiceImpl(
    new DashboardSuperAdminDAOImpl(prisma),
    new DashboardAdminDAOImpl(prisma),
    new DashboardAdvisorDAOImpl(prisma)
  );

  app.register(
    async (router) => {
      await registerAuthRoutes(router, authService);
      await registerUserRoutes(router, userService);
      await registerClientFileRoutes(router, clientFileService);
      await registerNotificationRoutes(router, notificationService);
      await registerMediaRoutes(router, mediaService);
      await registerDashboardRoutes(router, dashboardService);
    },
    { prefix: `/${config.server.prefix}/` }
  );
};
