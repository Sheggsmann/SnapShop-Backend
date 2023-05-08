import { config } from '@root/config';
import { reviewService } from '@service/db/review.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('Review Worker');

class ReviewWorker {
  public async addReviewToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await reviewService.addReviewToDB(value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const reviewWorker: ReviewWorker = new ReviewWorker();
