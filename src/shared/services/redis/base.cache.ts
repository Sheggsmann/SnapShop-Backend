import { config } from '@root/config';
import { RedisClient, RedisSingleton } from './connection';
import Logger from 'bunyan';

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
}
