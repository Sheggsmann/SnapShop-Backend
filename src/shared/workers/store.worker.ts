import { config } from '@root/config';
import { storeService } from '@service/db/store.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('Store Worker');

class StoreWorker {
  public async addStoreToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value, userId } = job.data;
      storeService.addStoreToDB(userId, value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const storeWorker: StoreWorker = new StoreWorker();
