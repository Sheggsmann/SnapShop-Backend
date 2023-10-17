import { ILocation, IStoreDocument } from '@store/interfaces/store.interface';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IProductDocument extends Document {
  _id: string | ObjectId;
  store: string | ObjectId | IStoreDocument;
  name: string;
  images: IProductFile[];
  videos: IProductFile[];
  price: number;
  priceDiscount: number;
  description: string;
  quantity?: number;
  category?: string;
  locations?: ILocation[];
}

export interface IProductJob {
  value?: IProductDocument;
  key?: string;
  storeId?: string;
}

export interface IProductFile {
  url: string;
  public_id?: string;
}

export interface IUpdateProductFile {
  uploaded?: { content: string }[];
  deleted?: string[];
}

/**
 * Stage 1:
 *
 * - find the products that match the query
 * - populate the stores
 * - filter by closest
 *
 * Stage 2:
 *
 * - find the products that match the query
 * - filter by location
 * - populate the stores
 *
 */
