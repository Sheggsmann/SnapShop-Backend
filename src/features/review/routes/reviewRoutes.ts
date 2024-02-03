import express, { Router } from 'express';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { createReview } from '../controllers/create-review';
import { getReview } from '../controllers/get-review';

class ReviewRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/product/reviews/:productId', getReview.reviews);
    this.router.get('/store/reviews/:storeId', getReview.storeReviews);
    this.router.post('/reviews', authMiddleware.protect, authMiddleware.checkAuth, createReview.review);

    return this.router;
  }
}

export const reviewRoutes: ReviewRoutes = new ReviewRoutes();
