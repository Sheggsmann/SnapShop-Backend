import { Job, DoneCallback } from 'bull';
import { config } from '@root/config';
import { searchesService } from '@service/db/searches.service';
import Logger from 'bunyan';

const log: Logger = config.createLogger('searches worker');

class SearchesWorker {
  async addSearchTermToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { data } = job;
      await searchesService.add(data.searchParam, data.location);

      job.progress(100);
      done(null, data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const searchesWorker: SearchesWorker = new SearchesWorker();
