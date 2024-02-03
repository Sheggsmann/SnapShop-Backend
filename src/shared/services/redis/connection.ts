import { createClient } from 'redis';
import { config } from '@root/config';

export type RedisClient = ReturnType<typeof createClient>;

export class RedisSingleton {
  private static instance: RedisSingleton;
  client: RedisClient;

  constructor() {
    this.client = createClient({ url: config.REDIS_HOST });
    this.cacheError();
  }

  static getInstance(): RedisSingleton {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = new RedisSingleton();
    }
    return RedisSingleton.instance;
  }

  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      console.error('\n\nREDIS ERROR:', error);
    });
  }

  public async lock(lockKey: string): Promise<boolean> {
    const result = await this.client.setNX(lockKey, '1');
    return result;
  }

  public async unlock(lockKey: string): Promise<void> {
    await this.client.del(lockKey);
  }
}
