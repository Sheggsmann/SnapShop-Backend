import express, { Router } from 'express';
import { signup } from '@auth/controllers/signup';
import { password } from '@auth/controllers/password';
import { siginin } from '@auth/controllers/signin';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/signup', signup.create);
    this.router.post('/signin', siginin.read);
    this.router.post('/store-signin', siginin.readStore);
    this.router.post('/validate-number', signup.exists);
    this.router.put('/verify-account', signup.verifyAccount);

    this.router.post('/resend-otp', signup.resendOtp);
    this.router.post('/forgot-password', password.create);
    this.router.post('/reset-password', password.update);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
