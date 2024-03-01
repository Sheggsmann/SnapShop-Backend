import Queue, { Job } from 'bull';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { config } from '@root/config';
import { IAuthJob } from '@auth/interfaces/auth.interface';
import { IUserJob } from '@user/interfaces/user.interface';
import { IStoreJob } from '@store/interfaces/store.interface';
import { IProductJob } from '@product/interfaces/product.interface';
import { IOrderJob } from '@order/interfaces/order.interface';
import { IMessageData, IMessageDocument } from '@chat/interfaces/chat.interface';
import { IReviewJob } from '@root/features/review/interfaces/review.interface';
import { ISearchesJob } from '@searches/interfaces/searches.interfaces';
import { INotificationJob } from '@root/features/notification/interfaces/notification.interface';
import { ITransactionDocument } from '@transactions/interfaces/transaction.interface';
import { IAnalyticsJob } from '@analytics/interfaces/analytics.interface';
import Logger from 'bunyan';
import { IEmailJob } from '@service/email/email.interface';

export let bullAdapters: BullAdapter[] = [];
export const serverAdapter: ExpressAdapter = new ExpressAdapter().setBasePath('/queues');

type IBaseJobData =
  | IAuthJob
  | IAnalyticsJob
  | IEmailJob
  | IUserJob
  | IStoreJob
  | IProductJob
  | IOrderJob
  | IMessageData
  | IMessageDocument
  | ISearchesJob
  | IReviewJob
  | INotificationJob
  | ITransactionDocument;

export abstract class BaseQueue {
  protected queue: Queue.Queue;
  log: Logger;

  constructor(queueName: string) {
    try {
      this.queue = new Queue(queueName, `${config.REDIS_HOST}`);
      this.log = config.createLogger(`${queueName} Queue`);

      bullAdapters.push(new BullAdapter(this.queue));
      bullAdapters = [...new Set(bullAdapters)];

      createBullBoard({ queues: bullAdapters, serverAdapter });

      this.queue.on('completed', (job: Job) => job.remove());
      this.queue.on('global:completed', (jobId: string) => this.log.info(`Job ${jobId} is completed`));
      this.queue.on('global:stalled', (jobId: string) => this.log.info(`Job ${jobId} is stalled`));
    } catch (err) {
      console.error(`\nERROR CREATING QUEUE:`, err);
      process.exit(1);
    }
  }

  protected addJob(name: string, data: IBaseJobData): void {
    this.queue.add(name, data, { attempts: 3, backoff: { type: 'fixed', delay: 50000 } });
  }

  protected processJob(
    name: string,
    concurrency: number,
    callback: Queue.ProcessCallbackFunction<void>
  ): void {
    this.queue.process(name, concurrency, callback);
  }
}
