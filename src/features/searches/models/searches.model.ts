import { ISearchesDocument } from '@searches/interfaces/searches.interfaces';
import { Model, Schema, model } from 'mongoose';

const searchesSchema: Schema = new Schema({
  searchParam: String,
  location: []
});

const SearchesModel: Model<ISearchesDocument> = model<ISearchesDocument>(
  'Searches',
  searchesSchema,
  'Searches'
);
export { SearchesModel };
