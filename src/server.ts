import Fastify from 'fastify';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySwagger from '@fastify/swagger';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyWebsocket from '@fastify/websocket';
import { logger, loggerConfig } from '@core/config/logger';
import { config } from '@core/config/env';
import { GlobalException } from '@core/exceptions/GlobalException';
import { authenticate } from '@core/middlewares/authenticate';
import { authorize } from '@core/middlewares/authorize';
import { registerRoutes } from './routes';
import { registerSchemas } from '@core/config/swagger/registerSchemas';
import { createDefaultSuperAdmin } from '@scripts/createDefaultSuperAdmin';
import cors from '@fastify/cors';
import { seedUserRoles } from '@scripts/seedRoles';
import fastifyMultipart from '@fastify/multipart';
import path from 'path';
import fastifyStatic from '@fastify/static';
import { registerWebSocketRoutes } from '@core/socket/webSocketRoutes';

const fastify = Fastify({ logger: loggerConfig });

fastify.register(cors, {
  origin: true, // ou ["http://localhost:3000"]
  credentials: true, // si tu envoies un cookie ou Authorization
  allowedHeaders: ['Content-Type', 'Authorization'], // important
  methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
});

fastify.register(fastifyMultipart);

fastify.register(fastifyStatic, {
  root: path.join(path.resolve(), 'public'),
  prefix: '/',
});

// Hook lors de la réception d'une requête
fastify.addHook('onRequest', (req, reply, done) => {
  req.log.info(`📡 Requête reçue: ${req.method} ${req.url}`);
  done();
});

// Hook pour activer les logs onSend et onError dans Fastify
fastify.addHook('onSend', async (request, reply, payload) => {
  request.log.info(`[${request.method}] ${request.url} -> ${reply.statusCode}`);
  return payload;
});

fastify.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error }, '❌ Erreur dans Fastify');
  reply.status(error.statusCode || 500).send({
    message: error.message,
  });
});

/**
 * Enregistrement de Swagger
 * 1. Schemas
 * 2. Swagger
 * 3. SawggerUi
 */
registerSchemas(fastify);
fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Services Financiers Etudiants API',
      description: 'API documentation',
      version: '1.0.0',
    },
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
});
fastify.register(fastifySwaggerUi, {
  routePrefix: `/${config.server.prefix}/docs`,
});

// Limitation de requêtes (100 par minute)
fastify.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
  cache: 10000,
  keyGenerator: (req) => req.ip,
  allowList: ['127.0.0.1', '91.108.102.152'], // Autoriser certaines IPs si nécessaire
  errorResponseBuilder: (req, context) => ({
    statusCode: 429,
    error: 'Too Many Requests',
    message: `Vous avez dépassé la limite de ${context.max} requêtes par minute.`,
  }),
});

// Set du GlobalException
fastify.setErrorHandler(GlobalException);

// Décorateurs
fastify.decorate('authenticate', authenticate);
fastify.decorate('authorize', authorize);

fastify.register(fastifyWebsocket);
fastify.register(registerWebSocketRoutes, {
  prefix: `/${config.server.prefix}`,
});

// Démarrage du serveur
export const startServer = async () => {
  try {
    await seedUserRoles();
    await registerRoutes(fastify);
    await createDefaultSuperAdmin();
    await fastify.listen({
      port: Number(config.server.port),
      host: '0.0.0.0', // 👈 autorise les connexions depuis toutes les interfaces réseau
    });
    logger.info(`Server running on ${config.server.host}`);
    return fastify;
  } catch (error) {
    logger.error('Erreur au démarrage de l’application', error);
    throw error;
  }
};
startServer();
