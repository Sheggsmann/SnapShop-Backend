import { authWorker } from '@worker/auth.worker';
import { BaseQueue } from './base.queue';
import { IAuthJob } from '@auth/interfaces/auth.interface';

class AuthQueue extends BaseQueue {
  constructor() {
    super('Auth');
    this.processJob('addAuthUserToDB', 5, authWorker.addAuthUserToDB);
  }

  public addAuthUserJob(name: string, data: IAuthJob): void {
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
