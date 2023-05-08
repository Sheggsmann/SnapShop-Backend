import { IReviewJob } from '@root/features/review/interfaces/review.interface';
import { BaseQueue } from './base.queue';
import { reviewWorker } from '@worker/review.worker';

class ReviewQueue extends BaseQueue {
  constructor() {
    super('Review');
    this.processJob('addReviewToDB', 5, reviewWorker.addReviewToDB);
  }

  public addReviewJob(name: string, data: IReviewJob): void {
    this.addJob(name, data);
  }
}

export const reviewQueue: ReviewQueue = new ReviewQueue();
