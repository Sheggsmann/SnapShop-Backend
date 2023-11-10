import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';
import { IProductDocument } from '@product/interfaces/product.interface';

export interface ILocation {
  type: string;
  coordinates: number[];
  address?: string;
  description?: string;
}

export interface IStoreDocument extends Document {
  _id: string | ObjectId;
  owner: string | ObjectId;
  escrowBalance: number;
  mainBalance: number;
  uId: string;
  name: string;
  bgImage: string;
  image: string;
  verified: boolean;
  description: string;
  locations: ILocation[];
  badges: string[];
  productsCount: number;
  productCategories: string[];
  ratingsCount: number;
  totalRatings: number;
  isOwner(userId: string): boolean;
}

export interface IStoreJob {
  value?: Partial<IStoreDocument>;
  userId?: string;
  key?: string;
}

export interface IStoreWithCategories {
  _id: string;
  products: IProductDocument[];
}
