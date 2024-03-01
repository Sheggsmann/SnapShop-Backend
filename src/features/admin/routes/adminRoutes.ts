import express, { Router } from 'express';
import { getMaintenance } from '@admin/controllers/get-maintenance';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { Role } from '@user/interfaces/user.interface';
import { getStores } from '@store/controllers/get-store';
import { getOrders } from '@order/controllers/get-order';
import { getUser } from '@user/controllers/get-user';
import { getSearches } from '@searches/controllers/get-searches';
import { getProduct } from '@product/controllers/get-product';
import { sendNotification } from '@root/features/notification/controllers/send-notification';
import { getTagsMappings } from '@admin/controllers/get-tags-mapping';
import { createTagMapping } from '@admin/controllers/create-tag-mapping';
import { getAnalytics } from '@analytics/controllers/get-analytics';

class AdminRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/maintenance', getMaintenance.maintenance);

    // Stores Routes
    this.router.get(
      '/stores/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getStores.all
    );

    // Orders Routes
    this.router.get(
      '/orders/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getOrders.all
    );

    // Users Routes
    this.router.get(
      '/users/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getUser.all
    );

    // Products Routes
    this.router.get(
      '/products/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getProduct.all
    );

    // Searches Routes
    this.router.get(
      '/searches/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getSearches.all
    );

    // Notification Routes
    this.router.post(
      '/notifications/to-user/:userId',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      sendNotification.toUser
    );
    this.router.post(
      '/notifications/to-store/:storeId',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      sendNotification.toStore
    );
    this.router.post(
      '/notifications/all-users',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      sendNotification.toAllUsers
    );
    this.router.post(
      '/notifications/all-stores',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      sendNotification.toAllStores
    );
    this.router.post(
      '/notifications/all',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      sendNotification.toAll
    );

    // Tags Mappings Routes
    this.router.get(
      '/tags-mappings/all',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getTagsMappings.tag
    );
    this.router.post(
      '/tags-mappings',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      createTagMapping.tag
    );

    // Analytics Routes
    this.router.get(
      '/analytics/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getAnalytics.all
    );

    return this.router;
  }
}

export const adminRoutes: AdminRoutes = new AdminRoutes();
