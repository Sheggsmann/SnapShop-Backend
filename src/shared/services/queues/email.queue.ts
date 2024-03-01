import { emailWorker } from '@worker/email.worker';
import { BaseQueue } from './base.queue';
import { IEmailJob } from '@service/email/email.interface';

class EmailQueue extends BaseQueue {
  constructor() {
    super('Email');
    this.processJob('sendMailToAdmins', 5, emailWorker.sendMailToAdmins);
  }

  public addEmailJob(name: string, data: IEmailJob): void {
    this.addJob(name, data);
  }
}

export const emailQueue: EmailQueue = new EmailQueue();
