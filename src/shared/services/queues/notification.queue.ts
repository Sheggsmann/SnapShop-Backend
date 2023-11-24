import { notificationWorker } from '@worker/notification.worker';
import { BaseQueue } from './base.queue';
import { INotificationJob } from '@root/features/notification/interfaces/notification.interface';

class NotificationQueue extends BaseQueue {
  constructor() {
    super('Notification');
    this.processJob('sendPushNotificationToUser', 5, notificationWorker.sendPushNotificationToUser);
    this.processJob('sendPushNotificationToStore', 5, notificationWorker.sendPushNotificationToStore);
  }

  public addNotificationJob(name: string, data: INotificationJob): void {
    this.addJob(name, data);
  }
}

export const notificationQueue: NotificationQueue = new NotificationQueue();
