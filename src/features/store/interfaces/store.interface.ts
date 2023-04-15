import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface ILocation {
  type: string;
  coordinates: number[];
  address?: string;
  description?: string;
}

export interface IStoreDocument extends Document {
  _id: string | ObjectId;
  owner: string | ObjectId;
  uId: string;
  name: string;
  bgImage: string;
  image: string;
  verified: boolean;
  description: string;
  locations: ILocation[];
  badges: string[];
  productsCount: number;
}

export interface IStoreJob {
  value?: IStoreDocument;
  userId?: string;
}
