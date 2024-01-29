import { IUserDocument } from '@user/interfaces/user.interface';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface ISearchesDocument extends Document {
  _id: string | ObjectId;
  searchParam: string;
  location: number[];
  user?: string | ObjectId | IUserDocument;
}

export interface ISearchesJob {
  searchParam: string;
  location: number[];
  user?: string | ObjectId | IUserDocument;
}
