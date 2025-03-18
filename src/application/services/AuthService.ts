import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, UserRole } from '../../domain/entities/User';

export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(
    name: string,
    email: string,
    password: string,
    role: UserRole = 'USER'
  ): Promise<string> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User(
        crypto.randomUUID(),
        name,
        email,
        hashedPassword,
        role
      );

      await this.userRepository.save(user);
      return this.generateToken(user.id, user.role);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erreur lors de l'inscription : ${error.message}`);
      }
      throw new Error('Une erreur inconnue est survenue');
    }
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    return this.generateToken(user.id, user.role);
  }

  private generateToken(userId: string, role: UserRole): string {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });
  }
}
