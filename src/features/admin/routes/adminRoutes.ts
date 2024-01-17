import express, { Router } from 'express';
import { getMaintenance } from '@admin/controllers/get-maintenance';

class AdminRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/maintenance', getMaintenance.maintenance);
    return this.router;
  }
}

export const adminRoutes: AdminRoutes = new AdminRoutes();
