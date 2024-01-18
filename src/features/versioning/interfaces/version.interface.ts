import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IVersionDocument extends Document {
  currentAppVersion: string;
  forceUpdate: boolean;
  update: boolean;
  app: 'user' | 'store';
  _id: string | ObjectId;
}
