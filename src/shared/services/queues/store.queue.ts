import { IStoreJob } from '@store/interfaces/store.interface';
import { BaseQueue } from './base.queue';
import { storeWorker } from '@worker/store.worker';

class StoreQueue extends BaseQueue {
  constructor() {
    super('Store');
    this.processJob('addStoreToDB', 5, storeWorker.addStoreToDB);
  }

  public addStoreJob(name: string, data: IStoreJob): void {
    this.addJob(name, data);
  }
}

export const storeQueue: StoreQueue = new StoreQueue();
