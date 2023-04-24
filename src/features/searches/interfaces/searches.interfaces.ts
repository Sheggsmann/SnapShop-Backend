import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export interface ISearchesDocument extends Document {
  _id: string | ObjectId;
  searchParam: string;
  location: number[];
}

export interface ISearchesJob {
  searchParam: string;
  location: number[];
}
