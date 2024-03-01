import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { IProductDocument } from '@product/interfaces/product.interface';
import { IUserDocument } from '@user/interfaces/user.interface';

export interface IAnalyticsDocument extends Document {
  store?: string | ObjectId | Partial<IStoreDocument>;
  product?: string | ObjectId | Partial<IProductDocument>;
  user?: string | ObjectId | Partial<IUserDocument>;
  createdAt: Date;
  event: string;
}

export interface IAnalyticsData {
  store?: IStoreDocument;
  product?: IProductDocument;
  user?: IUserDocument;
  event: string;
}

export interface IAnalyticsJob {
  value: IAnalyticsDocument;
}
