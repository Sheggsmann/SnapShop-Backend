import { BaseQueue } from './base.queue';
import { searchesWorker } from '@worker/searches.worker';
import { ISearchesJob } from '@searches/interfaces/searches.interfaces';

class SearchesQueue extends BaseQueue {
  constructor() {
    super('Searches');
    this.processJob('addSearchTermToDB', 5, searchesWorker.addSearchTermToDB);
  }

  public addSearchTermJob(name: string, data: ISearchesJob): void {
    this.addJob(name, data);
  }
}

export const searchesQueue: SearchesQueue = new SearchesQueue();
