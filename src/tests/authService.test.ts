import { AuthService } from '../application/services/AuthService';
import { User } from '../domain/entities/User';
import { UserRepository } from '../domain/repositories/UserRepository';

class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async update(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) this.users[index] = user;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }
}

test('Créer un utilisateur avec succès', async () => {
  const repo = new InMemoryUserRepository();
  const authService = new AuthService(repo);

  const token = await authService.register(
    'John Doe',
    'john@example.com',
    'password123',
    'USER'
  );
  expect(token).toBeDefined();
});
