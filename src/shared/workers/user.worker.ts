import { config } from '@root/config';
import { userService } from '@service/db/user.service';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('User Worker');

class UserWorker {
  public async addUserToDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await userService.createUser(value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }

  public async updateUserInDB(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, value } = job.data;
      await userService.updateUser(key, value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      done(err as Error);
    }
  }
}

export const userWorker: UserWorker = new UserWorker();
