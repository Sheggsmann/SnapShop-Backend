import { Job, DoneCallback } from 'bull';
import { config } from '@root/config';
import { notificationService } from '@service/db/notification.service';
import Logger from 'bunyan';

const log: Logger = config.createLogger('notification worker');

class NotificationWorker {
  async sendPushNotification(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, value } = job.data;
      await notificationService.sendSingleNotification(key, value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }

  async sendPushNotificationToUser(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, value } = job.data;
      await notificationService.sendNotificationToUser(key, value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }

  async sendPushNotificationToStore(job: Job, done: DoneCallback): Promise<void> {
    try {
      const { key, value } = job.data;
      await notificationService.sendNotificationToStore(key, value);

      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }

  async sendMultiplePushNotifications(job: Job, done: DoneCallback): Promise<void> {
    try {
      // key here should be an array, ie: ["ExponentPushToken[w7wngZJBLRjKkFMgS5lVzp]", "ExponentPushToken[w7wngZJBLRjKkFMgS5lVzp]"]
      const { key, value } = job.data;
      await notificationService.sendNotification(key, value);
      job.progress(100);
      done(null, job.data);
    } catch (err) {
      log.error(err);
      done(err as Error);
    }
  }
}

export const notificationWorker: NotificationWorker = new NotificationWorker();
