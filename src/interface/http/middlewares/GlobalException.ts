import { FastifyReply, FastifyRequest } from 'fastify';
import { BaseException } from '../../../core/exceptions/BaseException';
import { logger } from '../../../config/logger';
export const GlobalException = (
  error: Error,
  req: FastifyRequest,
  reply: FastifyReply
) => {
  let statusCode = 500;
  let message = 'Erreur interne du serveur';

  if (error instanceof BaseException) {
    statusCode = error.statusCode;
    message = error.message;
  }

  logger.error(`[${req.method}] ${req.url} - ${message}`);

  reply.status(statusCode).send({
    statusCode,
    error: error.name,
    message,
  });
};
