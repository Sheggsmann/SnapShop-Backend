import express, { Router } from 'express';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { createProduct } from '@product/controllers/create-product';
import { updateProduct } from '@product/controllers/update-product';
import { getProduct } from '@product/controllers/get-product';

class ProductRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/products/by-store/:storeId', authMiddleware.checkAuth, getProduct.productsByStoreId);
    this.router.get('/product/:productId', authMiddleware.checkAuth, getProduct.productByProductId);

    this.router.post(
      '/product',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      createProduct.product
    );

    this.router.put(
      '/product/:productId',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      updateProduct.product
    );

    this.router.put(
      '/product/media/:productId',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      updateProduct.productWithMedia
    );

    this.router.delete(
      '/product/:productId',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      updateProduct.deleteProduct
    );

    return this.router;
  }
}

export const productRoutes: ProductRoutes = new ProductRoutes();
