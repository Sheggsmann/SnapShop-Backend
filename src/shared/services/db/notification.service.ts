import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { userService } from './user.service';
import { IUserDocument } from '@user/interfaces/user.interface';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { storeService } from './store.service';

type NotificationMessage = Pick<ExpoPushMessage, 'body' | 'title'>;

class NotificationService {
  public expo: Expo | undefined;

  constructor() {
    this.expo = new Expo();
  }

  public async sendNotification(pushToken: string, notificationMessage: NotificationMessage): Promise<void> {
    console.log('\nSENDING PUSH NOTIFICATIOn');
    if (!Expo.isExpoPushToken(pushToken)) {
      console.log('\nINVALID PUSH TOKEN:', pushToken);
      return;
    }

    const messages: ExpoPushMessage[] = [];
    messages.push({
      to: pushToken,
      sound: 'default',
      body: notificationMessage.body,
      title: notificationMessage.title
    });

    const chunks = this.expo!.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];
    for (const chunk of chunks) {
      try {
        const ticketChunk: ExpoPushTicket[] = await this.expo!.sendPushNotificationsAsync(chunk);
        console.log('\nPUSH NOTIFICATION TICKET:', ticketChunk);
        tickets.push(...ticketChunk);
      } catch (err) {
        console.error(err);
      }
    }
  }

  public async sendSingleNotification(
    pushToken: string,
    notificationMessage: NotificationMessage
  ): Promise<void> {
    await this.sendNotification(pushToken, notificationMessage);
  }

  public async sendNotificationToUser(
    userId: string,
    notificationMessage: Pick<ExpoPushMessage, 'title' | 'body'>
  ): Promise<void> {
    const user: IUserDocument = await userService.getUserById(userId);
    if (!user) return;

    const pushToken = user.expoPushToken;
    await this.sendNotification(pushToken, notificationMessage);
  }

  public async sendNotificationToStore(
    storeId: string,
    notificationMessage: NotificationMessage
  ): Promise<void> {
    const store: IStoreDocument | null = await storeService.getStoreByStoreId(storeId);
    if (!store) return;

    const pushToken = store.expoPushToken;
    await this.sendNotification(pushToken, notificationMessage);
  }
}

export const notificationService: NotificationService = new NotificationService();
