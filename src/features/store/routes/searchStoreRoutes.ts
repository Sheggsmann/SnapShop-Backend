import express, { Router } from 'express';
import { searchStore } from '@store/controllers/search-store';

class SearchStoreRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/nearby-stores/:center', searchStore.store);
    return this.router;
  }
}

export const searchStoreRoutes: SearchStoreRoutes = new SearchStoreRoutes();
