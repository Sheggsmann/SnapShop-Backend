import { ILocation } from '@store/interfaces/store.interface';
import { Document } from 'mongodb';
import { ObjectId } from 'mongodb';

export interface IProductDocument extends Document {
  _id: string | ObjectId;
  store: string | ObjectId;
  name: string;
  images: string[];
  videos: string[];
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
