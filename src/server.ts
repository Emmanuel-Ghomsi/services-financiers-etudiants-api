/* eslint-disable no-undef */
import Fastify from 'fastify';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySwagger from '@fastify/swagger';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyWebsocket from '@fastify/websocket';
import { logger, loggerConfig } from '@core/config/logger';
import { WebSocketRegistry } from '@core/socket/WebSocketRegistry';
import { config } from '@core/config/env';
import { GlobalException } from '@core/exceptions/GlobalException';
import { authenticate } from '@core/middlewares/authenticate';
import { authorize } from '@core/middlewares/authorize';
import { registerRoutes } from './routes';
import { registerSchemas } from '@core/config/swagger/registerSchemas';

const fastify = Fastify({ logger: loggerConfig });

// Hook lors de la réception d'une requête
fastify.addHook('onRequest', (req, reply, done) => {
  req.log.info(`📡 Requête reçue: ${req.method} ${req.url}`);
  done();
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

fastify.register(fastifyWebsocket);

// Route WebSocket
fastify.get('/ws', { websocket: true }, (conn, req) => {
  const user = (req as any).user; // récupéré depuis token ou header auth
  if (!user || !user.id) {
    conn.socket.close();
    return;
  }

  // Ajouter la connexion au registre
  WebSocketRegistry.add({
    socket: conn.socket,
    userId: user.id,
  });

  conn.socket.on('close', () => {
    WebSocketRegistry.remove(conn.socket);
  });

  // Optionnel : ping de bienvenue
  conn.socket.send(
    JSON.stringify({ type: 'CONNECTED', message: 'WebSocket OK ✅' })
  );
});

// Démarrage du serveur
export const startServer = async () => {
  try {
    logger.info('Je suis lancé');
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
