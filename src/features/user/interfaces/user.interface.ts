import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export enum Role {
  User = 'User',
  StoreOwner = 'StoreOwner',
  Admin = 'Admin'
}

export interface IUserDocument extends Document {
  _id: string | ObjectId;
  email?: string;
  authId: string | ObjectId;
  password?: string;
  uId?: string;
  mobileNumber?: string;
  firstname: string;
  lastname: string;
  profilePicture: string;
  role: (keyof typeof Role)[];
  store?: ObjectId;
  createdAt?: Date;
  savedStores: mongoose.Types.ObjectId[];
  likedStores: mongoose.Types.ObjectId[];
  deliveryAddresses: [];
  notifications: INotificationSettings;
}

export interface INotificationSettings {
  messages: boolean;
}

export interface IUserJob {
  value: IUserDocument;
}
