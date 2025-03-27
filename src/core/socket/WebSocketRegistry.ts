import { WebSocket } from '@fastify/websocket';

type WSClient = {
  socket: WebSocket;
  userId: string;
};

export class WebSocketRegistry {
  private static clients: WSClient[] = [];

  static add(client: WSClient) {
    this.clients.push(client);
  }

  static remove(socket: WebSocket) {
    this.clients = this.clients.filter((c) => c.socket !== socket);
  }

  static notifyUser(userId: string, payload: any) {
    this.clients
      .filter((c) => c.userId === userId)
      .forEach((c) => c.socket.send(JSON.stringify(payload)));
  }

  static notifyMany(userIds: string[], payload: any) {
    this.clients
      .filter((c) => userIds.includes(c.userId))
      .forEach((c) => c.socket.send(JSON.stringify(payload)));
  }
}
