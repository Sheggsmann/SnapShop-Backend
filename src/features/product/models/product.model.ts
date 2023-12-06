import { IProductDocument } from '../interfaces/product.interface';
import { Model, Schema, Types, model } from 'mongoose';

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true, index: true },
    store: { type: Types.ObjectId, ref: 'Store', required: true, index: true },
    price: { type: Number, min: 0, default: 0, required: true },
    description: String,
    category: String,
    images: [{ url: String, public_id: String }],
    videos: [{ url: String, public_id: String }],
    purchaseCount: { type: Number, default: 0 },
    tags: [String],
    priceDiscount: Number,
    quantity: Number
  },
  { timestamps: true }
);

const ProductModel: Model<IProductDocument> = model<IProductDocument>('Product', productSchema, 'Product');
export { ProductModel };
