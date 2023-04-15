import express, { Router } from 'express';
import { createStore } from '@store/controllers/create-store';
import { authMiddleware } from '@global/middlewares/auth-middleware';

class StoreRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/store/signup', authMiddleware.checkAuth, createStore.store);

    return this.router;
  }
}

export const storeRoutes: StoreRoutes = new StoreRoutes();
