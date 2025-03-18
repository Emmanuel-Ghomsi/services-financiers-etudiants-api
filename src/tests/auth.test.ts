import request from 'supertest';
import { startServer } from '../server';

let app: any;

beforeAll(async () => {
  app = await startServer();
});

afterAll(async () => {
  if (app) {
    await app.close();
  }
});

test("Inscription d'un utilisateur", async () => {
  const response = await request('http://localhost:3000')
    .post('/auth/register')
    .send({
      name: 'John Doe',
      email: `test-${Date.now()}@example.com`,
      password: 'password123',
      role: 'USER',
    });

  expect(response.status).toBe(201);
  expect(response.body.token).toBeDefined();
});
