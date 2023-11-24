import { ExpoPushMessage } from 'expo-server-sdk';

export interface INotificationJob {
  key?: string;
  value?: Pick<ExpoPushMessage, 'body' | 'title'>;
}
