import express, { Router } from 'express';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { getUser } from '@user/controllers/get-user';
import { updateUser } from '@user/controllers/update-user';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/me', authMiddleware.checkAuth, getUser.me);
    this.router.get('/user/saved-stores', authMiddleware.checkAuth, getUser.savedStores);
    this.router.get('/user/liked-products', authMiddleware.checkAuth, getUser.likedProducts);
    this.router.get('/profile/:userId', authMiddleware.checkAuth, getUser.profile);

    this.router.put('/user', authMiddleware.checkAuth, updateUser.user);
    this.router.post('/user/like-product', authMiddleware.checkAuth, updateUser.likeProduct);
    this.router.post('/user/save-store', authMiddleware.checkAuth, updateUser.saveStore);
    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
