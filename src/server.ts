/* eslint-disable no-undef */
import Fastify from 'fastify';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySwagger from '@fastify/swagger';
import fastifyRateLimit from '@fastify/rate-limit';
import { logger, loggerConfig } from './core/config/logger';
import { GlobalException } from './core/exceptions/GlobalException';
import { config } from './core/config/env';
import { authenticate } from '@core/middlewares/authenticate';
import { authorize } from '@core/middlewares/authorize';
import { registerRoutes } from './routes';

const fastify = Fastify({ logger: loggerConfig });

// Hook lors de la réception d'une requête
fastify.addHook('onRequest', (req, reply, done) => {
  req.log.info(`📡 Requête reçue: ${req.method} ${req.url}`);
  done();
});

/**
 * Enregistrement de Swagger
 * 1. Swagger
 * 2. SawggerUi
 */
fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Service Financier API',
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
  allowList: ['127.0.0.1'], // Autoriser certaines IPs si nécessaire
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

// Démarrage du serveur
export const startServer = async () => {
  try {
    await registerRoutes(fastify);
    await fastify.listen({ port: Number(config.server.port) });
    logger.info(
      `Server running on ${config.server.host}:${config.server.port}`
    );
    return fastify;
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};
startServer();
