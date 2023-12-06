import express, { Router } from 'express';
import { authMiddleware } from '@global/middlewares/auth-middleware';
import { createFeedback } from '@feedback/controllers/create-feedback';
import { getFeedback } from '@feedback/controllers/get-feedback';

class FeedbackRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/feedback/:skip', authMiddleware.checkAuth, getFeedback.all);
    this.router.post('/feedback', authMiddleware.checkAuth, createFeedback.feedback);

    return this.router;
  }
}

export const feedbackRoutes: FeedbackRoutes = new FeedbackRoutes();
