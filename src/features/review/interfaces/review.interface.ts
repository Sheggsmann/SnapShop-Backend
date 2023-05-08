import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IReviewDocument extends Document {
  _id: string | ObjectId;
  product: string | ObjectId;
  store: string | ObjectId;
  user: string | ObjectId;
  productName: string;
  storeName: string;
  userName: string;
  body: string;
  rating: number;
  images?: [];
}

export interface IGetReviewsQuery {
  product?: string | ObjectId;
  user?: string | ObjectId;
}

export interface IReviewJob {
  value: IReviewDocument;
}
