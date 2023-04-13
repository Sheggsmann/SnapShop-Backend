import { IUserJob } from '@user/interfaces/user.interface';
import { BaseQueue } from './base.queue';
import { userWorker } from '@worker/user.worker';

class UserQueue extends BaseQueue {
  constructor() {
    super('User');
    this.processJob('addUserToDB', 5, userWorker.addUserToDB);
  }

  public addUserToDB(name: string, data: IUserJob): void {
    this.addJob(name, data);
  }
}

export const userQueue: UserQueue = new UserQueue();
