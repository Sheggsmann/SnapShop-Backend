import express, { Router } from 'express';
import { getMaintenance } from '@admin/controllers/get-maintenance';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { Role } from '@user/interfaces/user.interface';
import { getStores } from '@store/controllers/get-store';
import { getOrders } from '@order/controllers/get-order';
import { getUser } from '@user/controllers/get-user';
import { getSearches } from '@searches/controllers/get-searches';
import { getProduct } from '@product/controllers/get-product';

class AdminRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/maintenance', getMaintenance.maintenance);

    this.router.get(
      '/stores/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getStores.all
    );
    this.router.get(
      '/orders/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getOrders.all
    );
    this.router.get(
      '/users/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getUser.all
    );
    this.router.get(
      '/products/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getProduct.all
    );
    this.router.get(
      '/searches/all/:page',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      getSearches.all
    );

    return this.router;
  }
}

export const adminRoutes: AdminRoutes = new AdminRoutes();
