import express, { Router } from 'express';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { getUser } from '@user/controllers/get-user';
import { deleteUser } from '@user/controllers/delete-user';
import { updateUser } from '@user/controllers/update-user';
import { config } from '@root/config';

class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/me', authMiddleware.protect, authMiddleware.checkAuth, getUser.me);
    this.router.get('/user/feed', authMiddleware.protect, authMiddleware.checkAuth, getUser.feed);
    this.router.get(
      '/user/saved-stores',
      authMiddleware.protect,
      authMiddleware.checkAuth,
      getUser.savedStores
    );
    this.router.get(
      '/user/liked-products',
      authMiddleware.protect,
      authMiddleware.checkAuth,
      getUser.likedProducts
    );
    this.router.get('/user/auth/:userId', authMiddleware.protect, authMiddleware.checkAuth, getUser.auth);
    this.router.get('/profile/:userId', authMiddleware.protect, authMiddleware.checkAuth, getUser.profile);

    this.router.put('/user', authMiddleware.protect, authMiddleware.checkAuth, updateUser.user);
    this.router.post(
      '/user/like-product',
      authMiddleware.protect,
      authMiddleware.checkAuth,
      updateUser.likeProduct
    );
    this.router.post(
      '/user/save-store',
      authMiddleware.protect,
      authMiddleware.checkAuth,
      updateUser.saveStore
    );
    this.router.post('/user/store-expo-push-token', updateUser.savePushNotificationToken);

    if (config.NODE_ENV! === 'development') {
      this.router.delete('/user/:userId', deleteUser.user);
      this.router.post('/user/send-sms', updateUser.sendSms);
    }

    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
