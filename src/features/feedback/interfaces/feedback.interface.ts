import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface IFeedbackDocument extends Document {
  _id: string | ObjectId;
  title: string;
  description: string;
}
