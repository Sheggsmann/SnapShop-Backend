import { IGetReviewsQuery, IReviewDocument } from '@root/features/review/interfaces/review.interface';
import { ReviewModel } from '@root/features/review/models/review.model';

class ReviewService {
  public async addReviewToDB(data: IReviewDocument) {
    await ReviewModel.create(data);
  }

  public async getSingleReview(query: IGetReviewsQuery): Promise<IReviewDocument | null> {
    const review: IReviewDocument | null = await ReviewModel.findOne(query);
    return review;
  }

  public async getProductReviews(productId: string): Promise<IReviewDocument[]> {
    return (await ReviewModel.find({ product: productId }).limit(50)) as IReviewDocument[];
  }
}

export const reviewService: ReviewService = new ReviewService();
