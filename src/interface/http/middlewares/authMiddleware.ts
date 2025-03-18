import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

export const authMiddleware = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      reply.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
      role: string;
    };

    req.user = decoded;
  } catch (error) {
    reply.status(401).send({ error: 'Invalid token' });
  }
};

export const requireRole = (role: string) => {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    if (req.user?.role !== role) {
      reply.status(403).send({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
  };
};
