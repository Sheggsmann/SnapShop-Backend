import { Request, Response } from 'express';
import { IReviewDocument } from '../interfaces/review.interface';
import { reviewService } from '@service/db/review.service';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async reviews(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;
    const reviews: IReviewDocument[] = await reviewService.getProductReviews(productId);

    res.status(HTTP_STATUS.CREATED).json({ message: 'Product reviews', reviews });
  }
}

export const getReview: Get = new Get();
