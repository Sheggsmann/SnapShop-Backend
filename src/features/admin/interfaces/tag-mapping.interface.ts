import { Document } from 'mongoose';

export interface ITagsMappingDocument extends Document {
  name: string;
  tags: string[];
}
