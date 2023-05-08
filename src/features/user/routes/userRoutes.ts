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
    this.router.get('/profile/:userId', authMiddleware.checkAuth, getUser.profile);

    this.router.put('/user', authMiddleware.checkAuth, updateUser.user);

    return this.router;
  }
}

export const userRoutes: UserRoutes = new UserRoutes();
