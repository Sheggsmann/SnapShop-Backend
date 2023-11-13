import express, { Router } from 'express';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { createOrder } from '@order/controllers/create-order';
import { getOrders } from '@order/controllers/get-order';
import { updateOrder } from '@order/controllers/update-order';

class OrderRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get(
      '/order/my-orders',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['User']),
      getOrders.myOrders
    );

    this.router.get(
      '/order/store/:storeId',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      getOrders.storeOrders
    );

    this.router.get(
      '/order/:orderId',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['User']),
      getOrders.order
    );

    this.router.post(
      '/order/store/:storeId',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['User']),
      createOrder.order
    );

    this.router.post('/order/payment/verify', authMiddleware.checkAuth, updateOrder.orderPayment);

    return this.router;
  }
}

export const orderRoutes: OrderRoutes = new OrderRoutes();
