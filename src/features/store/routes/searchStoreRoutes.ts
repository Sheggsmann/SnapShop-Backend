import express, { Router } from 'express';
import { searchStore } from '@store/controllers/search-store';
import { getUser } from '@user/controllers/get-user';
import { getStores } from '@store/controllers/get-store';

class SearchStoreRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/nearby-stores/:center', searchStore.store);
    this.router.get('/guest/feed', getUser.guestFeed);
    this.router.get('/stores/s/:slug', getStores.storeByStoreSlug);
    return this.router;
  }
}

export const searchStoreRoutes: SearchStoreRoutes = new SearchStoreRoutes();
