import { IOrderJob } from '@order/interfaces/order.interface';
import { BaseQueue } from './base.queue';
import { orderWorker } from '@worker/order.worker';

class OrderQueue extends BaseQueue {
  constructor() {
    super('Order');
    this.processJob('addOrderToDB', 5, orderWorker.addOrderToDB);
    this.processJob('updateOrderInDB', 5, orderWorker.updateOrderInDB);
  }

  public addOrderJob(name: string, data: IOrderJob): void {
    this.addJob(name, data);
  }
}

export const orderQueue: OrderQueue = new OrderQueue();
