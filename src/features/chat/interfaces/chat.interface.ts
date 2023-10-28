import { IOrderData } from '@order/interfaces/order.interface';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IMessageDocument extends Document {
  _id: ObjectId;
  sender: ObjectId;
  receiver: ObjectId;
  senderType: 'User' | 'Store';
  receiverType: 'User' | 'Store';
  conversationId: ObjectId;
  userName: string;
  storeName: string;
  images: [];
  body: string;
  isRead: boolean;
  isOrder: boolean;
  isReply: boolean;
  deleted: boolean;
  order?: IOrderData;
  reply?: { messageId: ObjectId; body: string; images: [] };
  createdAt?: Date;
}

export interface IMessageData {
  _id: string | ObjectId;
  sender: string | ObjectId;
  receiver: string | ObjectId;
  senderType: 'User' | 'Store';
  receiverType: 'User' | 'Store';
  conversationId: string | ObjectId;
  images: [];
  body: string;
  isRead: boolean;
  isOrder: boolean;
  isReply: boolean;
  deleted: boolean;
  order?: IOrderData;
  reply?: { messageId: ObjectId; body: string; images: [] };
  createdAt?: Date;
}

export interface IChatUsers {
  userOne: string;
  userTwo: string;
}

export interface IChatList {
  receiverId: string;
  conversationId: string;
}

export interface IChatJobData {
  user?: string | ObjectId;
  store?: string | ObjectId;
  messageId?: string | ObjectId;
  userName?: string;
  storeName?: string;
  type?: string;
}
