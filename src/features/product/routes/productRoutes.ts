import express, { Router } from 'express';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { createProduct } from '@product/controllers/create-product';

class ProductRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post(
      '/product/:storeId/create',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      createProduct.product
    );

    return this.router;
  }
}

export const productRoutes: ProductRoutes = new ProductRoutes();
