import { IStoreDocument } from '@store/interfaces/store.interface';
import { Model, Schema, Types, model } from 'mongoose';

const storeSchema: Schema = new Schema(
  {
    name: { type: String, unique: true, required: true },
    owner: { type: Types.ObjectId, ref: 'User', index: true, required: true },
    uId: String,
    bgImage: String,
    image: String,
    description: String,
    locations: [
      {
        location: {
          type: { type: String, default: 'Point', enum: ['Point'] },
          coordinates: [Number]
        },
        address: String,
        isDefault: { type: Boolean, default: false }
      }
    ],
    verified: { type: Boolean, default: false },
    badges: [String],
    productsCount: { type: Number, default: 0 },
    productCategories: [String]
  },
  { timestamps: true }
);

storeSchema.index({ 'locations.location': '2dsphere' });

storeSchema.methods.isOwner = function (userId: string): boolean {
  return String(this.owner) === String(userId);
};

const StoreModel: Model<IStoreDocument> = model<IStoreDocument>('Store', storeSchema, 'Store');
export { StoreModel };
