import { createClient } from 'redis';
import { config } from '@root/config';
import Logger from 'bunyan';

export type RedisClient = ReturnType<typeof createClient>;

export abstract class BaseCache {
  client!: RedisClient;
  log: Logger;

  constructor(cacheName: string) {
    this.log = config.createLogger(cacheName);
    try {
      this.client = createClient({ url: config.REDIS_HOST });
      this.cacheError();
    } catch (err) {
      this.log.error(err);
      process.exit(1);
    }
  }

  private cacheError(): void {
    this.client.on('error', (error: unknown) => {
      this.log.error(error);
    });
  }
}
