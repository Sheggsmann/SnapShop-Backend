import { IReviewDocument } from '../interfaces/review.interface';
import { Model, Schema, Types, model } from 'mongoose';

const reviewSchema: Schema = new Schema({
  product: Types.ObjectId,
  store: Types.ObjectId,
  user: Types.ObjectId,
  productName: String,
  storeName: String,
  userName: String,
  body: String,
  rating: Number,
  type: { type: String, enum: ['product', 'store'] },
  images: []
});

const ReviewModel: Model<IReviewDocument> = model<IReviewDocument>('Review', reviewSchema, 'Review');
export { ReviewModel };
