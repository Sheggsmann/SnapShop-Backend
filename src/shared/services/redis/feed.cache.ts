import { IFeed } from '@user/interfaces/user.interface';
import { BaseCache } from './base.cache';
import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { IProductDocument } from '@product/interfaces/product.interface';
import Logger from 'bunyan';

const CACHE_NAME = 'FeedCache';

const logger: Logger = config.createLogger(CACHE_NAME);

const ONE_HOUR_TTL = 60 * 60;
const THIRTY_MINS_TTL = 60 * 30;

export class FeedCache extends BaseCache {
  constructor() {
    super(CACHE_NAME);
  }

  public async getProductsByDeviceId(deviceId: string): Promise<IProductDocument[]> {
    try {
      if (!this.client.isOpen) await this.client.connect();
      const cachedData = await this.client.get(`exploreProducts:${deviceId}`);
      if (cachedData) return JSON.parse(cachedData) as IProductDocument[];
      return [] as IProductDocument[];
    } catch (err) {
      logger.error(err);
      throw new ServerError('Server Error, Try Again.');
    }
  }

  public async mapProductIdsToDeviceId(
    deviceId: string,
    products: Partial<IProductDocument>[]
  ): Promise<void> {
    try {
      if (!this.client.isOpen) await this.client.connect();

      const productIds = products.map((product) => product._id);
      const shownProductIds: IProductDocument[] = await this.getProductsByDeviceId(deviceId);
      await this.client.setEx(
        `exploreProducts:${deviceId}`,
        THIRTY_MINS_TTL,
        JSON.stringify([...shownProductIds, ...productIds])
      );
    } catch (err) {
      logger.error(err);
      throw new ServerError('Server Error, Try Again.');
    }
  }

  public async saveFeedDataToCache(userId: string, feedData: IFeed[]): Promise<void> {
    try {
      if (!this.client.isOpen) await this.client.connect();
      await this.client.setEx(`feed:${userId}`, ONE_HOUR_TTL, JSON.stringify(feedData));
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
