import { IFeed } from '@user/interfaces/user.interface';
import { BaseCache } from './base.cache';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import Logger from 'bunyan';

const CACHE_NAME = 'FeedCache';

const logger: Logger = config.createLogger(CACHE_NAME);

export class FeedCache extends BaseCache {
  constructor() {
    super(CACHE_NAME);
  }

  public async saveFeedDataToCache(userId: string, feedData: IFeed[]): Promise<void> {
    try {
      if (!this.client.isOpen) await this.client.connect();
      await this.client.setEx(`feed:${userId}`, 60 * 60 * 1, JSON.stringify(feedData));
    } catch (err) {
      logger.error(err);
      throw new ServerError('Server Error, Try Again.');
    }
  }

  public async getFeedData(userId: string): Promise<IFeed[] | null> {
    try {
      if (!this.client.isOpen) await this.client.connect();

      const cachedData = await this.client.get(`feed:${userId}`);
      if (cachedData) {
        return JSON.parse(cachedData) as IFeed[];
      }
      return null;
    } catch (err) {
      logger.error(err);
      throw new ServerError('Server Error, Try Again.');
    }
  }
}
