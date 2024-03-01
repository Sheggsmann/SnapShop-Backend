import { config } from '@root/config';
import { emailTransport } from '@service/email/email.transport';
import { DoneCallback, Job } from 'bull';
import Logger from 'bunyan';

const log: Logger = config.createLogger('Email Worker');

class EmailWorker {
  public async sendMailToAdmins(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { value } = job.data;
      await emailTransport.sendMailToAdmins(value.title, value.body);
      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const emailWorker: EmailWorker = new EmailWorker();
