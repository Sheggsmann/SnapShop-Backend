import { config } from '@root/config';
import { orderService } from '@service/db/order.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('Order Worker');

class OrderWorker {
  public async addOrderToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await orderService.addOrderToDB(value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }

  public async updateOrderInDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, value } = job.data;
      await orderService.updateOrder(key, value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const orderWorker: OrderWorker = new OrderWorker();
