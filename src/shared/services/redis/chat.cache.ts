import { BaseCache } from './base.cache';

const CACHE_NAME = 'ChatCache';

export class ChatCache extends BaseCache {
  constructor() {
    super(CACHE_NAME);
  }

  public async userIsOnline(userId: string): Promise<void> {
    if (!this.client.isOpen) await this.client.connect();

    await this.client.sAdd('online_users', userId);
  }

  public async userIsOffline(userId: string): Promise<void> {
    if (!this.client.isOpen) await this.client.connect();

    await this.client.sRem('online_users', userId);
  }

  public async isUerOnline(userId: string): Promise<boolean> {
    if (!this.client.isOpen) await this.client.connect();
    return await this.client.sIsMember('online_users', userId);
  }
}
