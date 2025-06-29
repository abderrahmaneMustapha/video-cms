import Redis from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async increment(key: string, ttl?: number): Promise<number> {
    const multi = this.redis.multi();

    multi.incr(key);

    if (ttl) {
      multi.expire(key, ttl);
    }

    const results = await multi.exec();

    return results?.[0][1] as number;
  }

  async decrement(key: string): Promise<number> {
    return this.redis.decr(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
      return;
    }

    await this.redis.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async delete(key: string): Promise<number> {
    return this.redis.del(key);
  }
}
