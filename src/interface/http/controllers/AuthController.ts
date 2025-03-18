import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../../../application/services/AuthService';
import { UserRepositoryPrisma } from '../../../infrastructure/repositories/UserRepositoryPrisma';

const authService = new AuthService(new UserRepositoryPrisma());

const registerSchema = {
  description: 'Créer un utilisateur',
  tags: ['Auth'],
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
      role: { type: 'string', enum: ['USER', 'ADMIN'] },
    },
  },
  response: {
    201: {
      description: 'Utilisateur créé',
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
  },
};
async function registerHandler(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role: 'USER' | 'ADMIN';
    };

    if (!name || !email || !password || !role) {
      reply.status(400).send({ error: "Tous les champs sont requis" });
      return;
    }

    const token = await authService.register(name, email, password, role);
    reply.status(201).send({ token });
  } catch (error) {
    if (error instanceof Error) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(400).send({ error: 'Une erreur inconnue est survenue' });
    }
  }
}

const loginSchema = {
  description: 'Authentifier un utilisateur',
  tags: ['Auth'],
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
    },
  },
  response: {
    200: {
      description: 'Utilisateur authentifié',
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
    401: {
      description: "Échec de l'authentification",
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};
async function loginHandler(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const token = await authService.login(email, password);
    reply.send({ token });
  } catch (error) {
    reply.status(401).send({ error: 'Invalid credentials' });
  }
}

export { registerSchema, registerHandler, loginSchema, loginHandler };
