import express, { Router } from 'express';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { createOrder } from '@order/controllers/create-order';
import { getOrders } from '@order/controllers/get-order';
import { updateOrder } from '@order/controllers/update-order';
import { config } from '@root/config';
import { declineOrder } from '@order/controllers/decline-order';
import { reportOrder } from '@order/controllers/report-order';

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

    this.router.put('/order/:orderId', authMiddleware.checkAuth, updateOrder.order);
    this.router.put('/order/verify/:orderId', authMiddleware.checkAuth, updateOrder.completeOrder);
    this.router.put(
      '/order/decline/:orderId',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['StoreOwner']),
      declineOrder.byStore
    );
    this.router.put(
      '/order/report/:orderId',
      authMiddleware.checkAuth,
      authMiddleware.restrictTo(['User']),
      reportOrder.report
    );

    if (config.NODE_ENV === 'development') {
      this.router.post('/dev/order/payment', authMiddleware.checkAuth, updateOrder.devOrderPayment);
    }

    return this.router;
  }
}

export const orderRoutes: OrderRoutes = new OrderRoutes();
