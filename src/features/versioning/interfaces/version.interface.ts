import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IVersionDocument extends Document {
  currentAppVersion: string;
  forceUpdate: boolean;
  _id: string | ObjectId;
}
