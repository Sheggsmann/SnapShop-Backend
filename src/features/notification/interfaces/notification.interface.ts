import { ExpoPushMessage } from 'expo-server-sdk';

export interface INotificationJob {
  key?: string | string[];
  value?: Pick<ExpoPushMessage, 'body' | 'title'>;
}
