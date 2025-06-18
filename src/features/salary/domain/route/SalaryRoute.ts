import { FastifyInstance } from 'fastify';
import { SalaryController } from '../controller/SalaryController';
import { SalaryService } from '../service/SalaryService';
import { zodToSwaggerSchema } from '@core/utils/zodToSwagger';

export async function registerSalaryRoutes(
  server: FastifyInstance,
  service: SalaryService
) {
  const controller = new SalaryController(service);

  server.post('/salaries', {
    schema: {
      tags: ['Salaries'],
      summary: 'Créer une fiche de salaire',
      body: zodToSwaggerSchema('CreateSalaryRequest'),
      response: { 201: { $ref: 'SalaryDTO' } },
    },
    handler: controller.createSalary.bind(controller),
  });

  server.put('/salaries/:id', {
    schema: {
      tags: ['Salaries'],
      summary: 'Mettre à jour une fiche',
      body: zodToSwaggerSchema('UpdateSalaryRequest'),
      response: {
        200: { $ref: 'SalaryDTO' },
        404: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
    handler: controller.updateSalary.bind(controller),
  });

  server.get('/salaries/:id', {
    schema: {
      tags: ['Salaries'],
      summary: 'Voir une fiche par ID',
      response: {
        200: { $ref: 'SalaryDTO' },
        404: { type: 'object', properties: { message: { type: 'string' } } },
      },
    },
    handler: controller.getSalaryById.bind(controller),
  });

  server.get('/salaries', {
    schema: {
      tags: ['Salaries'],
      summary: 'Lister les fiches de salaire paginées',
      querystring: zodToSwaggerSchema('SalaryListRequest'),
      response: { 200: { $ref: 'SalaryPaginationDTO' } },
    },
    handler: controller.getPaginatedSalaries.bind(controller),
  });

  server.delete('/salaries/:id', {
    schema: {
      tags: ['Salaries'],
      summary: 'Supprimer une fiche',
      response: { 204: { type: 'null' } },
    },
    handler: controller.deleteSalary.bind(controller),
  });

  server.get('/salaries/:id/pdf-data', {
    schema: {
      tags: ['Salaries'],
      summary: 'Obtenir les données PDF pour une fiche de paie',
      response: {
        200: { $ref: 'SalaryPdfDataDTO' },
        404: {
          type: 'object',
          properties: { message: { type: 'string' } },
        },
      },
    },
    handler: controller.getSalaryPdfData.bind(controller),
  });

  server.get('/salaries/employee/:employeeId', {
    schema: {
      tags: ['Salaries'],
      summary: 'Lister les fiches de paie d’un employé',
      response: {
        200: {
          type: 'array',
          items: { $ref: 'SalaryDTO' },
        },
      },
    },
    handler: controller.getSalariesByEmployee.bind(controller),
  });

  server.get('/salaries/by-period', {
    schema: {
      tags: ['Salaries'],
      summary: 'Vue RH : salaires par période (mois/année)',
      querystring: zodToSwaggerSchema('SalaryPeriodFilterRequest'),
      response: {
        200: {
          type: 'array',
          items: { $ref: 'SalaryPeriodDTO' },
        },
      },
    },
    handler: controller.getSalariesByPeriod.bind(controller),
  });

  server.get('/salaries/by-period/paginated', {
    schema: {
      tags: ['Salaries'],
      summary: 'Vue RH paginée des salaires par période',
      querystring: zodToSwaggerSchema('SalaryPeriodPaginatedRequest'),
      response: {
        200: { $ref: 'SalaryPeriodPaginationDTO' },
      },
    },
    handler: controller.getSalariesByPeriodPaginated.bind(controller),
  });
}
