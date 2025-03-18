import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';

export class UserRepositoryPrisma implements UserRepository {
  private prisma = new PrismaClient();

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return new User(user.id, user.name, user.email, user.password);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User(user.id, user.name, user.email, user.password);
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({ data: user });
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.id },
      data: { name: user.name, email: user.email, password: user.password },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
