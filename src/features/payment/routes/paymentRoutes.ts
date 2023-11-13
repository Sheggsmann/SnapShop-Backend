import { updateOrder } from '@order/controllers/update-order';
import express, { Router } from 'express';

class PaymentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    // Add IP address whitelist
    this.router.post('/payment/order/verify', updateOrder.orderPayment);

    return this.router;
  }
}

export const paymentRoutes: PaymentRoutes = new PaymentRoutes();
