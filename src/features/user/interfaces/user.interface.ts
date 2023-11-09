import mongoose, { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { IProductDocument } from '@product/interfaces/product.interface';

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
  source?: string;
  roles: (keyof typeof Role)[];
  storeCount: number;
  createdAt?: Date;
  savedStores: mongoose.Types.ObjectId[] | string[];
  likedProducts: mongoose.Types.ObjectId[] | string[];
  deliveryAddresses: [];
  notifications: INotificationSettings;
}

export interface INotificationSettings {
  messages: boolean;
}

export interface IFeed {
  title: string;
  subtitle: string;
  content: IStoreDocument[] | IProductDocument[];
}

export interface IUserJob {
  value?: Partial<IUserDocument>;
  key?: string;
}
