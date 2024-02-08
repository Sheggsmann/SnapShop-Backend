import express, { Router } from 'express';
import { createStore } from '@store/controllers/create-store';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { getStores } from '@store/controllers/get-store';
import { updateStore } from '@store/controllers/update-store';
import { shareStore } from '@store/controllers/share-store';

class StoreRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/store/me', authMiddleware.checkAuth, getStores.myStore);
    this.router.get(
      '/store/product-categories',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      getStores.productCategories
    );
    this.router.get(
      '/store/products',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      getStores.products
    );
    this.router.get('/stores/:storeId', authMiddleware.checkAuth, getStores.storeByStoreId);
    this.router.get(
      '/store/:storeId/link',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      shareStore.getSlugLink
    );

    this.router.put('/stores/verify/:storeId', authMiddleware.checkAuth, updateStore.verify);
    this.router.put(
      '/stores/:storeId',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      updateStore.store
    );
    this.router.put('/stores/:storeId/updateLocation', authMiddleware.checkAuth, updateStore.storeLocation);

    this.router.post('/store/signup', authMiddleware.checkAuth, createStore.store);
    this.router.post(
      '/store/:storeId/slug',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      shareStore.createStoreSlug
    );
    this.router.post(
      '/store/store-expo-push-token',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      updateStore.savePushNotificationToken
    );
    this.router.post(
      '/store/product-categories',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      createStore.productCategory
    );

    return this.router;
  }
}

export const storeRoutes: StoreRoutes = new StoreRoutes();
