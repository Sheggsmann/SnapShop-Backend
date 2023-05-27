import { IGetReviewsQuery, IReviewDocument } from '@root/features/review/interfaces/review.interface';
import { ReviewModel } from '@root/features/review/models/review.model';
import { FilterQuery } from 'mongoose';

class ReviewService {
  public async addReviewToDB(data: IReviewDocument) {
    await ReviewModel.create(data);
  }

  public async getSingleReview(query: FilterQuery<IGetReviewsQuery>): Promise<IReviewDocument | null> {
    const review: IReviewDocument | null = await ReviewModel.findOne(query);
    return review;
  }

  public async getProductReviews(productId: string): Promise<IReviewDocument[]> {
    return (await ReviewModel.find({ product: productId }).limit(50)) as IReviewDocument[];
  }

  public async getStoreReviews(storeId: string): Promise<IReviewDocument[]> {
    return (await ReviewModel.find({ store: storeId }).limit(50)) as IReviewDocument[];
  }
}

export const reviewService: ReviewService = new ReviewService();
