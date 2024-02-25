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
    this.router.get('/products/by-store/:storeId', getProduct.productsByStoreId);
    this.router.get(
      '/product/:productId',
      authMiddleware.protect,
      authMiddleware.checkAuth,
      getProduct.productByProductId
    );

    this.router.post(
      '/product',
      authMiddleware.protect,
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      createProduct.product
    );

    this.router.put(
      '/product/:productId',
      authMiddleware.protect,
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner', 'Admin']),
      updateProduct.product
    );

    this.router.put(
      '/product/media/:productId',
      authMiddleware.protect,
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner', 'Admin']),
      updateProduct.productWithMedia
    );

    this.router.delete(
      '/product/:productId',
      authMiddleware.protect,
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      updateProduct.deleteProduct
    );

    return this.router;
  }
}

export const productRoutes: ProductRoutes = new ProductRoutes();
