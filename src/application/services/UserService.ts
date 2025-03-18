import { ResourceNotFoundException } from '../../core/exceptions/ResourceNotFoundException';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { CacheService } from '../../infrastructure/cache/CacheService';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private cacheService: CacheService
  ) {}

  async getUser(id: string) {
    if (!id) {
      throw new ValidationException("L'ID de l'utilisateur est requis.");
    }

    const cacheKey = `user:${id}`;
    const cachedUser = await this.cacheService.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ResourceNotFoundException('Utilisateur', id);
    }

    await this.cacheService.set(cacheKey, JSON.stringify(user), 300); // Cache pendant 5 min

    return user;
  }
}
