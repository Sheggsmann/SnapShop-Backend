import { authMiddleware } from '@global/middlewares/auth-middleware';
import { Role } from '@user/interfaces/user.interface';
import { addVersion } from '@versioning/controllers/create-version';
import { getVersion } from '@versioning/controllers/get-version';
import { updateVersion } from '@versioning/controllers/update-version';
import express, { Router } from 'express';

class VersionRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.get('/app-version', getVersion.appVersion);
    this.router.get('/app-version/:app', getVersion.appVersion);
    this.router.put(
      '/app-version',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      updateVersion.appVersion
    );
    this.router.post(
      '/app-version',
      authMiddleware.protect,
      authMiddleware.restrictTo([Role.Admin]),
      addVersion.appVersion
    );
    return this.router;
  }
}

export const versionRoutes: VersionRoutes = new VersionRoutes();
