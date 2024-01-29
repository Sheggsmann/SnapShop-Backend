import { ISearchesDocument } from '@searches/interfaces/searches.interfaces';
import { Model, Schema, model, Types } from 'mongoose';

const searchesSchema: Schema = new Schema(
  {
    searchParam: String,
    location: [],
    user: { ref: 'User', type: Types.ObjectId, index: true }
  },
  {
    timestamps: true
  }
);

const SearchesModel: Model<ISearchesDocument> = model<ISearchesDocument>(
  'Searches',
  searchesSchema,
  'Searches'
);
export { SearchesModel };
