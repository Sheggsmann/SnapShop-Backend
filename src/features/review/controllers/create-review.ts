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
import { storeService } from '@service/db/store.service';
import { storeQueue } from '@service/queues/store.queue';
import { orderService } from '@service/db/order.service';
import HTTP_STATUS from 'http-status-codes';

class Create {
  @validator(reviewSchema)
  public async review(req: Request, res: Response): Promise<void> {
    const { body, rating, productId, storeId, type } = req.body;

    let reviewItem: IProductDocument | IStoreDocument | null = null;

    if (type === 'product') {
      reviewItem = await productService.getProductById(productId);
    } else if (type == 'store') {
      reviewItem = await storeService.getStoreByStoreId(storeId);
    }

    if (!reviewItem) throw new NotFoundError('Item to review not found');

    if (
      type === 'product' &&
      ((reviewItem as IProductDocument).store as IStoreDocument)._id.toString() ===
        req.currentUser?.storeId?.toString()
    ) {
      throw new BadRequestError('You cannot review your product');
    }

    if (
      type === 'store' &&
      (reviewItem as IStoreDocument)._id.toString() === req.currentUser?.storeId?.toString()
    ) {
      throw new BadRequestError('You cannot review your store');
    }

    const existingReview = await reviewService.getSingleReview({
      user: req.currentUser!.userId,
      $or: [{ product: reviewItem._id }, { store: reviewItem._id }]
    });

    if (existingReview) {
      throw new BadRequestError(`You already reviewed this ${type}`);
    }

    if (type === 'store') {
      const hasPurchaseFromStore = await orderService.userHasFinalizedOrderFromStore(
        req.currentUser!.userId,
        storeId
      );
      if (!hasPurchaseFromStore) {
        throw new BadRequestError("You haven't purchased any product from this store.");
      }
    }

    if (type === 'product') {
      const hasPurchasedProduct = await orderService.productHasFinalizedOrder(productId);
      if (!hasPurchasedProduct) {
        throw new BadRequestError("You haven't purchased this product");
      }
    }

    const user: IUserDocument = await userService.getUserById(req.currentUser!.userId);

    const review: IReviewDocument = {
      user: user._id,
      userName: `${user.firstname} ${user.lastname}`,
      product: type === 'product' ? reviewItem._id : null,
      productName: type === 'product' ? reviewItem.name : '',
      store: type === 'store' ? reviewItem._id : null,
      storeName: type === 'store' ? reviewItem.name : '',
      body,
      rating
    } as IReviewDocument;

    reviewQueue.addReviewJob('addReviewToDB', { value: review });

    if (type === 'store') {
      storeQueue.addStoreJob('updateStoreInDB', {
        key: `${reviewItem._id}`,
        value: {
          ratingsCount: (reviewItem as IStoreDocument).ratingsCount + rating,
          totalRatings: (reviewItem as IStoreDocument).totalRatings + 1
        }
      });
    }

    res.status(HTTP_STATUS.CREATED).json({ message: 'Created successfully', review });
  }
}

export const createReview: Create = new Create();
