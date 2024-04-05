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
    this.router.get('/store/auth/me', authMiddleware.checkAuth, getStores.myStore);
    this.router.get(
      '/stores/product-categories',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      getStores.productCategories
    );
    this.router.get(
      '/stores/products',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      getStores.products
    );
    this.router.get('/stores/:storeId', authMiddleware.checkAuth, getStores.storeByStoreId);
    this.router.get(
      '/stores/:storeId/link',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      shareStore.getSlugLink
    );

    this.router.put('/stores/verify/:storeId', authMiddleware.checkAuth, updateStore.verify);
    this.router.put(
      '/stores/product-categories',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      updateStore.productCategory
    );
    this.router.put(
      '/stores/:storeId',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      updateStore.store
    );
    this.router.put('/stores/:storeId/updateLocation', authMiddleware.checkAuth, updateStore.storeLocation);

    this.router.post('/stores/signup', authMiddleware.checkAuth, createStore.store);
    this.router.post(
      '/stores/:storeId/slug',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      shareStore.createStoreSlug
    );
    this.router.post(
      '/stores/store-expo-push-token',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      updateStore.savePushNotificationToken
    );
    this.router.post(
      '/stores/product-categories',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      createStore.productCategory
    );

    return this.router;
  }
}

export const storeRoutes: StoreRoutes = new StoreRoutes();
