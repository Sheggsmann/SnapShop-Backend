import { IAnalyticsJob } from '@analytics/interfaces/analytics.interface';
import { BaseQueue } from './base.queue';
import { analyticsWorker } from '@worker/analytics.worker';

class AnalyticsQueue extends BaseQueue {
  constructor() {
    super('Analytics');
    this.processJob('addAnalyticsToDB', 5, analyticsWorker.addAnalyticsToDB);
  }

  public addAnalyticsJob(name: string, data: IAnalyticsJob): void {
    this.addJob(name, data);
  }
}

export const analyticsQueue: AnalyticsQueue = new AnalyticsQueue();
