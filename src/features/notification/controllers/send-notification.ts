import { validator } from '@global/helpers/joi-validation-decorator';
import { notificationService } from '@service/db/notification.service';
import { storeService } from '@service/db/store.service';
import { userService } from '@service/db/user.service';
import { notificationQueue } from '@service/queues/notification.queue';
import { Request, Response } from 'express';
import { notificationMessageSchema } from '../schemes/notification.scheme';
import HTTP_STATUS from 'http-status-codes';

class Send {
  @validator(notificationMessageSchema)
  public async toUser(req: Request, res: Response): Promise<void> {
    const { message, title } = req.body;
    const { userId } = req.params;
    await notificationService.sendNotificationToUser(userId, {
      title,
      body: message
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Push notification sent successfully' });
  }

  @validator(notificationMessageSchema)
  public async toStore(req: Request, res: Response): Promise<void> {
    const { message, title } = req.body;
    const { storeId } = req.params;
    await notificationService.sendNotificationToStore(storeId, { title, body: message });
    res.status(HTTP_STATUS.OK).json({ message: 'Push notification sent successfully' });
  }

  @validator(notificationMessageSchema)
  public async toAllUsers(req: Request, res: Response): Promise<void> {
    // TODO: Implement strategy for batching
    const { message, title } = req.body;
    const users = await userService.getUsers(0, 2147483647);
    const userPushTokens = [];

    for (const user of users) {
      if (user?.expoPushToken) {
        userPushTokens.push(user.expoPushToken);
      }
    }

    notificationQueue.addNotificationJob('sendPushtNotificationToAllUsers', {
      key: userPushTokens,
      value: {
        title,
        body: message
      }
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Push notification sent successfully' });
  }

  @validator(notificationMessageSchema)
  public async toAllStores(req: Request, res: Response): Promise<void> {
    const { message, title } = req.body;
    const stores = await storeService.getStores(0, 2147483647);
    const storePushTokens = [];

    for (const store of stores) {
      if (store?.expoPushToken) {
        storePushTokens.push(store.expoPushToken);
      }
    }

    notificationQueue.addNotificationJob('sendPushtNotificationToAllStores', {
      key: storePushTokens,
      value: {
        title,
        body: message
      }
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Push notification sent successfully' });
  }

  @validator(notificationMessageSchema)
  public async toAll(req: Request, res: Response): Promise<void> {
    // TODO: Implement strategy to send this through a job queue and to use batching..
    const { title, message } = req.body;

    const [users, stores] = await Promise.all([
      userService.getUsers(0, 2147483647),
      storeService.getStores(0, 2147483647)
    ]);

    const pushTokens = [];

    const usersLength = users.length;
    const storesLength = stores.length;
    const maxLength = Math.max(usersLength, storesLength);

    for (let i = 0; i < maxLength; i++) {
      if (i < usersLength) {
        if (users[i]?.expoPushToken) {
          pushTokens.push(users[i].expoPushToken);
        }
      }

      if (i < storesLength) {
        if (stores[i]?.expoPushToken) {
          pushTokens.push(stores[i]?.expoPushToken);
        }
      }
    }

    notificationQueue.addNotificationJob('sendPushNotificationToAll', {
      key: pushTokens,
      value: {
        title,
        body: message
      }
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Push notification sent successfully' });
  }
}

export const sendNotification: Send = new Send();
