import { balanceWithdraw } from '@balanceWithdrawal/controllers/balance-withdraw';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import express, { Router } from 'express';

class BalanceWithdrawalRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post(
      '/balance/requests',
      authMiddleware.restrictTo(['StoreOwner']),
      balanceWithdraw.requestWithdrawal
    );
    // this.router.get("/balance/requests", authMiddleware.restrictTo(["Admin"]))

    return this.router;
  }
}

export const balanceWithdrawalRoutes: BalanceWithdrawalRoutes = new BalanceWithdrawalRoutes();
