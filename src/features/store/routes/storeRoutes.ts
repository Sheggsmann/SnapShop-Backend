import express, { Router } from 'express';
import { createStore } from '@store/controllers/create-store';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { getStores } from '@store/controllers/get-store';
import { updateStore } from '@store/controllers/update-store';

class StoreRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/stores/all/:page', authMiddleware.checkAuth, getStores.all);
    this.router.get(
      '/store/product-categories',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      getStores.productCategories
    );
    this.router.get('/stores/:storeId', authMiddleware.checkAuth, getStores.storeByStoreId);

    this.router.put('/stores/verify/:storeId', authMiddleware.checkAuth, updateStore.verify);
    this.router.put('/stores/:storeId', authMiddleware.checkAuth, updateStore.store);

    this.router.post('/store/signup', authMiddleware.checkAuth, createStore.store);
    this.router.post(
      '/store/product-category',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      createStore.productCategory
    );

    return this.router;
  }
}

export const storeRoutes: StoreRoutes = new StoreRoutes();
