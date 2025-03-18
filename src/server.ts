import Fastify from 'fastify';
import userRoutes from './interface/http/routes/userRoutes';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastifySwagger from '@fastify/swagger';
import fastifyRateLimit from '@fastify/rate-limit';
import { loggerConfig } from './config/logger';
import { GlobalException } from './interface/http/middlewares/GlobalException';

const fastify = Fastify({ logger: loggerConfig });

fastify.addHook('onRequest', (req, reply, done) => {
  req.log.info(`📡 Requête reçue: ${req.method} ${req.url}`);
  done();
});

fastify.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'Boilerplate API',
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

fastify.register(fastifySwaggerUi, { routePrefix: '/docs' });

// Limitation de requêtes (100 par minute)
fastify.register(fastifyRateLimit, {
  max: 100, // Max 100 requêtes par minute
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

fastify.register(userRoutes);

fastify.setErrorHandler(GlobalException);

export const startServer = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running on http://localhost:3000");
    return fastify; // ✅ Retourne l'instance Fastify
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
