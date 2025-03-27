import { FastifyInstance } from 'fastify';
import { ClientFileService } from '../service/ClientFileService';
import { ClientFileController } from '../controller/ClientFileController';
import { zodToSwaggerSchema } from '@core/utils/zodToSwagger';

/**
 * Enregistrement des routes liées aux fiches clients
 */
export async function registerClientFileRoutes(
  app: FastifyInstance,
  service: ClientFileService
) {
  const prefix = '/client-files';

  // 📌 Création
  app.post(
    `${prefix}`,
    {
      schema: {
        body: zodToSwaggerSchema('ClientFileCreateRequest'),
        tags: ['ClientFile'],
        summary: 'Créer une fiche client',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) => ClientFileController.create(req as any, res, service)
  );

  // 🔎 Récupérer une fiche
  app.get(
    `${prefix}/:id`,
    {
      schema: {
        tags: ['ClientFile'],
        summary: 'Consulter une fiche client par ID',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) => ClientFileController.getOne(req as any, res, service)
  );

  // 📄 Liste des fiches créées par l'utilisateur connecté
  app.get(
    `${prefix}/me`,
    {
      schema: {
        tags: ['ClientFile'],
        summary: "Lister les fiches de l'utilisateur connecté",
      },
      preHandler: [app.authenticate],
    },
    async (req, res) => ClientFileController.getMyFiles(req, res, service)
  );

  // 🗂️ Liste de toutes les fiches (admin / super-admin)
  app.get(
    `${prefix}`,
    {
      schema: {
        tags: ['ClientFile'],
        summary: 'Lister toutes les fiches (admin only)',
      },
      preHandler: [app.authenticate, app.authorize(['ADMIN', 'SUPER_ADMIN'])],
    },
    async (req, res) => ClientFileController.getAll(req, res, service)
  );

  // 🗑️ Suppression (soft)
  app.delete(
    `${prefix}/:id`,
    {
      schema: {
        tags: ['ClientFile'],
        summary: 'Supprimer une fiche client (soft delete)',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) => ClientFileController.delete(req as any, res, service)
  );

  // ✅ Validation admin
  app.patch(
    `${prefix}/:id/validate-admin`,
    {
      schema: {
        tags: ['ClientFile'],
        summary: "Valider une fiche client en tant qu'admin",
      },
      preHandler: [app.authenticate, app.authorize(['ADMIN'])],
    },
    async (req, res) =>
      ClientFileController.validateAsAdmin(req as any, res, service)
  );

  // ✅ Validation super-admin
  app.patch(
    `${prefix}/:id/validate-superadmin`,
    {
      schema: {
        tags: ['ClientFile'],
        summary: 'Valider une fiche client en tant que super-admin',
      },
      preHandler: [app.authenticate, app.authorize(['SUPER_ADMIN'])],
    },
    async (req, res) =>
      ClientFileController.validateAsSuperAdmin(req as any, res, service)
  );

  // ❌ Rejet avec motif
  app.patch(
    `${prefix}/:id/reject`,
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            reason: { type: 'string' },
          },
          required: ['reason'],
        },
        tags: ['ClientFile'],
        summary: 'Rejeter une fiche avec un motif',
      },
      preHandler: [app.authenticate, app.authorize(['ADMIN', 'SUPER_ADMIN'])],
    },
    async (req, res) => ClientFileController.reject(req as any, res, service)
  );

  // --- Routes multi-étapes ---

  app.patch(
    `${prefix}/:id/identity`,
    {
      schema: {
        body: zodToSwaggerSchema('ClientFileIdentityRequest'),
        tags: ['ClientFile'],
        summary: 'Étape 1 - Identité',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      ClientFileController.updateIdentity(req as any, res, service)
  );

  app.patch(
    `${prefix}/:id/address`,
    {
      schema: {
        body: zodToSwaggerSchema('ClientFileAddressRequest'),
        tags: ['ClientFile'],
        summary: 'Étape 2 - Coordonnées',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      ClientFileController.updateAddress(req as any, res, service)
  );

  app.patch(
    `${prefix}/:id/activity`,
    {
      schema: {
        body: zodToSwaggerSchema('ClientFileActivityRequest'),
        tags: ['ClientFile'],
        summary: 'Étape 3 - Activité',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      ClientFileController.updateActivity(req as any, res, service)
  );

  app.patch(
    `${prefix}/:id/situation`,
    {
      schema: {
        body: zodToSwaggerSchema('ClientFileSituationRequest'),
        tags: ['ClientFile'],
        summary: 'Étape 4 - Situation client',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      ClientFileController.updateSituation(req as any, res, service)
  );

  app.patch(
    `${prefix}/:id/international`,
    {
      schema: {
        body: zodToSwaggerSchema('ClientFileInternationalRequest'),
        tags: ['ClientFile'],
        summary: 'Étape 5 - Transactions internationales',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      ClientFileController.updateInternational(req as any, res, service)
  );

  app.patch(
    `${prefix}/:id/services`,
    {
      schema: {
        body: zodToSwaggerSchema('ClientFileServicesRequest'),
        tags: ['ClientFile'],
        summary: 'Étape 6 - Produits & services',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      ClientFileController.updateServices(req as any, res, service)
  );

  app.patch(
    `${prefix}/:id/operation`,
    {
      schema: {
        body: zodToSwaggerSchema('ClientFileOperationRequest'),
        tags: ['ClientFile'],
        summary: 'Étape 7 - Fonctionnement du compte',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      ClientFileController.updateOperation(req as any, res, service)
  );

  app.patch(
    `${prefix}/:id/pep`,
    {
      schema: {
        body: zodToSwaggerSchema('ClientFilePepRequest'),
        tags: ['ClientFile'],
        summary: 'Étape 8 - PPE',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) => ClientFileController.updatePEP(req as any, res, service)
  );

  app.patch(
    `${prefix}/:id/compliance`,
    {
      schema: {
        body: zodToSwaggerSchema('ClientFileComplianceRequest'),
        tags: ['ClientFile'],
        summary: 'Étape 9 - LBC/FT',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      ClientFileController.updateCompliance(req as any, res, service)
  );

  app.get(
    '/client-files/:id/export/pdf',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['ClientFile'],
        summary: 'Exporter une fiche client au format PDF',
      },
    },
    async (req, res) => ClientFileController.exportPDF(req as any, res, service)
  );

  app.get(
    '/client-files/:id/export/word',
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ['ClientFile'],
        summary: 'Exporter une fiche client au format Word',
      },
    },
    async (req, res) =>
      ClientFileController.exportWord(req as any, res, service)
  );

  app.patch(
    '/client-files/:id/fund-origin',
    {
      schema: {
        body: zodToSwaggerSchema('ClientFileFundOriginRequest'),
        tags: ['ClientFile'],
        summary: 'Étape - Origine des fonds',
      },
      preHandler: [app.authenticate],
    },
    async (req, res) =>
      ClientFileController.updateFundOrigin(req as any, res, service)
  );
}
