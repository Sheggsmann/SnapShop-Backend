import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IMessageDocument extends Document {
  _id: ObjectId;
  user: ObjectId;
  store: ObjectId;
  conversationId: ObjectId;
  userName: string;
  storeName: string;
  images: [];
  body: string;
  isRead: boolean;
  isOrder: boolean;
  isReply: boolean;
  deleted: boolean;
  order?: string | ObjectId;
  reply?: { messageId: ObjectId; body: string; images: [] };
  createdAt?: Date;
}

export interface IMessageData {
  _id: string | ObjectId;
  user: string | ObjectId;
  store: string | ObjectId;
  conversationId: string | ObjectId;
  userName: string;
  storeName: string;
  images: [];
  body: string;
  isRead: boolean;
  isOrder: boolean;
  isReply: boolean;
  deleted: boolean;
  order?: string | ObjectId;
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
