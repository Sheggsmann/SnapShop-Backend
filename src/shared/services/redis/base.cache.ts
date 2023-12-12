import { createClient } from 'redis';
import { config } from '@root/config';
import Logger from 'bunyan';

export type RedisClient = ReturnType<typeof createClient>;

export class RedisSingleton {
  private static instance: RedisSingleton;
  client: RedisClient;

  private constructor() {
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
      console.error(error);
    });
  }
}

export abstract class BaseCache {
  protected client!: RedisClient;
  log: Logger;

  constructor(cacheName: string) {
    this.log = config.createLogger(cacheName);
    this.client = RedisSingleton.getInstance().client;
    // try {
    //   this.client = createClient({ url: config.REDIS_HOST });
    //   this.cacheError();
    // } catch (err) {
    //   this.log.error(err);
    //   process.exit(1);
    // }
  }

  // private cacheError(): void {
  //   this.client.on('error', (error: unknown) => {
  //     this.log.error(error);
  //   });
  // }
}
