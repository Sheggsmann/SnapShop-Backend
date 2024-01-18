import { IVersionDocument } from '@versioning/interfaces/version.interface';
import { Model, Schema, model } from 'mongoose';

const versioningSchema: Schema = new Schema(
  {
    currentAppVersion: String,
    update: Boolean,
    forceUpdate: Boolean,
    app: {
      type: String,
      default: 'store',
      enum: ['user', 'store']
    }
  },
  { timestamps: true }
);

export const VersionModel: Model<IVersionDocument> = model<IVersionDocument>(
  'Versioning',
  versioningSchema,
  'Versioning'
);
