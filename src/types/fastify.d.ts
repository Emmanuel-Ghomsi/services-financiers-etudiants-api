/* eslint-disable no-unused-vars */
import 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
    authorize: (roles: string[]) => any;
  }

  interface FastifyRequest {
    user?: any;
  }
}
