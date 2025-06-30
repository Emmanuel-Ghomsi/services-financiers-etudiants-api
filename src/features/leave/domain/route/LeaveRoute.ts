import { FastifyInstance } from 'fastify';
import { LeaveService } from '../service/LeaveService';
import { LeaveController } from '../controller/LeaveController';
import { zodToSwaggerSchema } from '@core/utils/zodToSwagger';

export async function registerLeaveRoutes(
  server: FastifyInstance,
  service: LeaveService
) {
  const controller = new LeaveController(service);

  server.post('/leaves', {
    schema: {
      tags: ['Leaves'],
      summary: 'Créer une demande de congé',
      body: zodToSwaggerSchema('CreateLeaveRequest'),
      response: {
        201: { $ref: 'LeaveDTO' },
      },
    },
    handler: controller.createLeave.bind(controller),
  });

  server.put('/leaves/:id', {
    schema: {
      tags: ['Leaves'],
      summary: 'Mettre à jour une demande (validation ou rejet)',
      body: zodToSwaggerSchema('UpdateLeaveRequest'),
      response: {
        200: { $ref: 'LeaveDTO' },
        404: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
    handler: controller.updateLeave.bind(controller),
  });

  server.get('/leaves/:id', {
    schema: {
      tags: ['Leaves'],
      summary: 'Obtenir une demande par ID',
      response: {
        200: { $ref: 'LeaveDTO' },
        404: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
    handler: controller.getLeaveById.bind(controller),
  });

  server.get('/leaves/employee/:employeeId', {
    schema: {
      tags: ['Leaves'],
      summary: 'Lister les congés d’un employé',
      response: {
        200: { type: 'array', items: { $ref: 'LeaveDTO' } },
      },
    },
    handler: controller.getLeavesByEmployee.bind(controller),
  });

  server.get('/leaves', {
    schema: {
      tags: ['Leaves'],
      summary: 'Lister tous les congés (paginés)',
      querystring: zodToSwaggerSchema('LeaveListRequest'),
      response: {
        200: { $ref: 'LeavePaginationDTO' },
      },
    },
    handler: controller.getPaginatedLeaves.bind(controller),
  });

  server.delete('/leaves/:id', {
    schema: {
      tags: ['Leaves'],
      summary: 'Supprimer une demande de congé',
      response: {
        204: { type: 'null' },
      },
    },
    handler: controller.deleteLeave.bind(controller),
  });

  server.get('/leaves/balance', {
    schema: {
      tags: ['Leaves'],
      summary: 'Solde de congés annuel par employé',
      querystring: zodToSwaggerSchema('LeaveBalanceRequest'),
      response: {
        200: { $ref: 'LeaveBalanceDTO' },
      },
    },
    handler: controller.getLeaveBalance.bind(controller),
  });

  server.get('/leaves/balances', {
    schema: {
      tags: ['Leaves'],
      summary: 'Solde de congés de tous les employés',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              employeeId: { type: 'string' },
              acquired: { type: 'number' },
              taken: { type: 'number' },
              remaining: { type: 'number' },
            },
          },
        },
      },
    },
    handler: controller.getAllLeaveBalances.bind(controller),
  });

  server.get('/leaves/calendar', {
    schema: {
      tags: ['Leaves'],
      summary: 'Vue calendrier des absences',
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string' },
              absences: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    employeeId: { type: 'string' },
                    employeeName: { type: 'string' },
                    leaveType: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    handler: controller.getAbsenceCalendar.bind(controller),
  });

  server.get('/leaves/statistics', {
    schema: {
      tags: ['Leaves'],
      summary:
        'Statistiques des congés approuvés (année, par employé ou global)',
      querystring: zodToSwaggerSchema('LeaveStatsRequest'),
      response: {
        200: { $ref: 'LeaveStatsDTO' },
      },
    },
    handler: controller.getStatistics.bind(controller),
  });

  server.patch(`/leaves/:id/validate-admin`, {
    schema: {
      body: zodToSwaggerSchema('ValidateLeaveRequest'),
      tags: ['Leaves'],
      summary: "Valider un congé en tant qu'admin",
    },
    preHandler: [server.authenticate, server.authorize(['ADMIN'])],
    handler: controller.validateAsAdmin.bind(controller),
  });

  server.patch(`/leaves/:id/validate-superadmin`, {
    schema: {
      body: zodToSwaggerSchema('ValidateLeaveRequest'),
      tags: ['Leaves'],
      summary: 'Valider un congé en tant que super-admin',
    },
    preHandler: [server.authenticate, server.authorize(['SUPER_ADMIN'])],
    handler: controller.validateAsSuperAdmin.bind(controller),
  });

  server.patch(`/leaves/:id/reject`, {
    schema: {
      body: zodToSwaggerSchema('RejectExpenseRequest'),
      tags: ['Leaves'],
      summary: 'Rejeter un congé avec un motif',
    },
    preHandler: [
      server.authenticate,
      server.authorize(['ADMIN', 'SUPER_ADMIN']),
    ],
    handler: controller.reject.bind(controller),
  });

  server.patch('/leaves/:id/status', {
    schema: {
      body: zodToSwaggerSchema('UpdateLeaveStatusRequest'),
      tags: ['Leaves'],
      summary: 'Modifier le statut d’un congé',
    },
    preHandler: [server.authenticate],
    handler: controller.updateLeave.bind(controller),
  });
}
