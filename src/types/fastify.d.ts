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

  interface FastifyReply {
    sendFile(filename: string, rootPath?: string): FastifyReply;
  }
  interface FastifyRequest {
    user: {
      id: string;
      username: string;
      email: string;
      roles: string[];
    };
  }
}
