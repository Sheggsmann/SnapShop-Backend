import express, { Router } from 'express';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { getTransactions } from '@transactions/controllers/get-transactions';

class TransactionRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/transactions/user/:userId', authMiddleware.checkAuth, getTransactions.userTransactions);
    this.router.get(
      '/transactions/store/:storeId',
      authMiddleware.checkAuth,
      getTransactions.storeTransactions
    );

    return this.router;
  }
}

export const transactionRoutes: TransactionRoutes = new TransactionRoutes();
