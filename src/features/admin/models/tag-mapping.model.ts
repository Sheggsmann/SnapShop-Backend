import { ITagsMappingDocument } from '@admin/interfaces/tag-mapping.interface';
import { Model, Schema, model } from 'mongoose';

const tagsMappingSchema: Schema = new Schema({
  name: String,
  tags: [String]
});

const TagsMappingModel: Model<ITagsMappingDocument> = model<ITagsMappingDocument>(
  'TagsMapping',
  tagsMappingSchema,
  'TagsMapping'
);
export { TagsMappingModel };
