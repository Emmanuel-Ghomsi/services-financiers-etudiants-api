import { redis } from '../../config/redis';

export class CacheService {
  async get(key: string): Promise<string | null> {
    return await redis.get(key);
  }

  async set(key: string, value: string, ttl = 60): Promise<void> {
    await redis.set(key, value, 'EX', ttl);
  }

  async del(key: string): Promise<void> {
    await redis.del(key);
  }
}
