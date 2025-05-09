import { FastifyInstance } from 'fastify';
import { WebSocketRegistry } from '@core/socket/WebSocketRegistry';
import jwt from 'jsonwebtoken';
import { config } from '@core/config/env';
import { URL } from 'url';
import { logger } from '../config/logger';

interface JWTPayload {
  id: string;
  email: string;
  username: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

export async function registerWebSocketRoutes(app: FastifyInstance) {
  app.get('/ws', { websocket: true }, (conn, req) => {
    try {
      const protocol = req.headers['x-forwarded-proto'] ?? 'http';
      const url = new URL(req.url, `${protocol}://${req.headers.host}`);
      const token = url.searchParams.get('token');

      if (!token) {
        conn.socket.close();
        return;
      }

      const payload = jwt.verify(token, config.jwt.secret) as JWTPayload;

      if (!payload?.id) {
        conn.socket.close();
        return;
      }

      // Enregistrement du socket de l'utilisateur
      WebSocketRegistry.add({
        userId: payload.id,
        socket: conn.socket,
      });

      conn.socket.send(
        JSON.stringify({ type: 'CONNECTED', message: 'WebSocket OK ✅' })
      );

      conn.socket.on('close', () => {
        WebSocketRegistry.remove(conn.socket);
      });
    } catch (err) {
      logger.error('❌ Erreur WebSocket :', err);
      conn.socket.close();
    }
  });
}
