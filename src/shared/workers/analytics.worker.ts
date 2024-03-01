import { config } from '@root/config';
import { analyticsService } from '@service/db/analytics.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('Analytics Worker');

class AnalyticsWorker {
  public async addAnalyticsToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await analyticsService.addAnalyticsToDB(value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const analyticsWorker: AnalyticsWorker = new AnalyticsWorker();
