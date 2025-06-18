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
import { ExpenseServiceImpl } from '@features/expense/domain/service/ExpenseServiceImpl';
import { ExpenseDAOImpl } from '@features/expense/data/dao/ExpenseDAOImpl';
import { registerExpenseRoutes } from '@features/expense/domain/route/ExpenseRoute';
import { SalaryServiceImpl } from '@features/salary/domain/service/SalaryServiceImpl';
import { SalaryDAOImpl } from '@features/salary/data/dao/SalaryDAOImpl';
import { registerSalaryRoutes } from '@features/salary/domain/route/SalaryRoute';
import { LeaveServiceImpl } from '@features/leave/domain/service/LeaveServiceImpl';
import { LeaveDAOImpl } from '@features/leave/data/dao/LeaveDAOImpl';
import { registerLeaveRoutes } from '@features/leave/domain/route/LeaveRoute';
import { SalaryAdvanceDAOImpl } from '@features/salary/data/dao/SalaryAdvanceDAOImpl';
import { SalaryAdvanceServiceImpl } from '@features/salary/domain/service/SalaryAdvanceServiceImpl';
import { registerSalaryAdvanceRoutes } from '@features/salary/domain/route/SalaryAdvanceRoute';
import { DashboardDAOImpl } from '@features/dashboard/data/dao/DashboardDAOImpl';

export const registerRoutes = async (app: FastifyInstance) => {
  const prisma = new PrismaClient();
  const userDAO = new UserDAOImpl(prisma);
  const clientFileDAO = new ClientFileDAOImpl(prisma);
  const notificationDAO = new NotificationDAOImpl(prisma);
  const mediaDAO = new MediaDAOImpl();
  const dashboardDAO = new DashboardDAOImpl(prisma);

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
    new DashboardAdvisorDAOImpl(prisma),
    dashboardDAO
  );
  const expenseService = new ExpenseServiceImpl(new ExpenseDAOImpl());
  const leaveService = new LeaveServiceImpl(new LeaveDAOImpl());

  const salaryAdvanceDAO = new SalaryAdvanceDAOImpl(prisma);
  const salaryAdvanceService = new SalaryAdvanceServiceImpl(salaryAdvanceDAO);

  const salaryDAO = new SalaryDAOImpl(prisma);
  const salaryService = new SalaryServiceImpl(salaryDAO, salaryAdvanceService);

  app.register(
    async (router) => {
      await registerAuthRoutes(router, authService);
      await registerUserRoutes(router, userService);
      await registerClientFileRoutes(router, clientFileService);
      await registerNotificationRoutes(router, notificationService);
      await registerMediaRoutes(router, mediaService);
      await registerDashboardRoutes(router, dashboardService);
      await registerExpenseRoutes(router, expenseService);
      await registerSalaryRoutes(router, salaryService);
      await registerSalaryAdvanceRoutes(router, salaryAdvanceService);
      await registerLeaveRoutes(router, leaveService);
    },
    { prefix: `/${config.server.prefix}/` }
  );
};
