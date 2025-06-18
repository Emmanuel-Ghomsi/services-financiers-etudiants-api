import { FastifyInstance } from 'fastify';
import { ExpenseController } from '../controller/ExpenseController';
import { ExpenseService } from '../service/ExpenseService';
import { zodToSwaggerSchema } from '@core/utils/zodToSwagger';

export async function registerExpenseRoutes(
  server: FastifyInstance,
  service: ExpenseService
) {
  const controller = new ExpenseController(service);

  server.post('/expenses', {
    schema: {
      tags: ['Expenses'],
      summary: 'Créer une dépense',
      body: zodToSwaggerSchema('CreateExpenseRequest'),
      response: {
        201: { $ref: 'ExpenseDTO' },
      },
    },
    handler: controller.createExpense.bind(controller),
  });

  server.get('/expenses/:id', {
    schema: {
      tags: ['Expenses'],
      summary: 'Récupérer une dépense par ID',
      response: {
        200: { $ref: 'ExpenseDTO' },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: controller.getExpenseById.bind(controller),
  });

  server.get('/expenses', {
    schema: {
      tags: ['Expenses'],
      summary: 'Lister les dépenses paginées',
      querystring: zodToSwaggerSchema('ExpenseListRequest'),
      response: {
        200: { $ref: 'ExpensePaginationDTO' },
      },
    },
    handler: controller.getPaginatedExpenses.bind(controller),
  });

  server.put('/expenses/:id', {
    schema: {
      tags: ['Expenses'],
      summary: 'Mettre à jour une dépense',
      body: zodToSwaggerSchema('UpdateExpenseRequest'),
      response: {
        200: { $ref: 'ExpenseDTO' },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    handler: controller.updateExpense.bind(controller),
  });

  server.delete('/expenses/:id', {
    schema: {
      tags: ['Expenses'],
      summary: 'Supprimer une dépense',
      response: {
        204: { type: 'null' },
      },
    },
    handler: controller.deleteExpense.bind(controller),
  });

  server.get('/expenses/filter', {
    schema: {
      tags: ['Expenses'],
      summary: 'Filtrer les dépenses par date, catégorie, employé ou projet',
      querystring: zodToSwaggerSchema('ExpenseFilterRequest'),
      response: {
        200: {
          type: 'array',
          items: { $ref: 'ExpenseDTO' },
        },
      },
    },
    handler: controller.filterExpenses.bind(controller),
  });

  server.get('/expenses/statistics', {
    schema: {
      tags: ['Expenses'],
      summary: 'Obtenir les statistiques annuelles des dépenses',
      querystring: zodToSwaggerSchema('ExpenseStatsRequest'),
      response: {
        200: { $ref: 'ExpenseStatsDTO' },
      },
    },
    handler: controller.getStatistics.bind(controller),
  });

  server.post('/expenses/:id/upload', {
    schema: {
      tags: ['Expenses'],
      consumes: ['multipart/form-data'],
      summary: 'Uploader une pièce justificative pour une dépense',
    },
    preHandler: [server.authenticate],
    handler: controller.uploadPieceJustificative.bind(controller),
  });

  server.get('/expenses/:id/justificatif', {
    schema: {
      tags: ['Expenses'],
      summary:
        'Télécharger ou consulter la pièce justificative liée à une dépense',
      response: {
        200: {
          description: 'Fichier retourné',
          type: 'string',
          format: 'binary',
        },
        404: {
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
        },
      },
    },
    preHandler: [server.authenticate],
    handler: controller.downloadPieceJustificative.bind(controller),
  });
}
