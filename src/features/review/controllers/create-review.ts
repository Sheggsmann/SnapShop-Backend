import { Request, Response } from 'express';
import { IReviewDocument } from '../interfaces/review.interface';
import { reviewQueue } from '@service/queues/review.queue';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { IProductDocument } from '@product/interfaces/product.interface';
import { productService } from '@service/db/product.service';
import { BadRequestError, NotFoundError } from '@global/helpers/error-handler';
import { IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/user.service';
import { reviewService } from '@service/db/review.service';
import { validator } from '@global/helpers/joi-validation-decorator';
import { reviewSchema } from '../schemes/review.scheme';
import HTTP_STATUS from 'http-status-codes';

class Create {
  @validator(reviewSchema)
  public async review(req: Request, res: Response): Promise<void> {
    const { body, rating, productId } = req.body;

    const product: IProductDocument | null = await productService.getProductById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const existingReview = await reviewService.getSingleReview({
      product: product._id,
      user: req.currentUser!.userId
    });

    if (existingReview) {
      throw new BadRequestError('You already reviewed this product');
    }

    const user: IUserDocument = await userService.getUserById(req.currentUser!.userId);

    const review: IReviewDocument = {
      user: user._id,
      userName: `${user.firstname} ${user.lastname}`,
      product: product._id,
      productName: product.name,
      store: (product.store as IStoreDocument)?._id,
      storeName: (product.store as IStoreDocument)?.name,
      body,
      rating
    } as IReviewDocument;

    reviewQueue.addReviewJob('addReviewToDB', { value: review });

    res.status(HTTP_STATUS.CREATED).json({ message: 'Created successfully', review });
  }
}

export const createReview: Create = new Create();
