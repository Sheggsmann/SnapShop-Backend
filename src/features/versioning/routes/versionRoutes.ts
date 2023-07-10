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
    this.router.put('/app-version', updateVersion.appVersion);
    return this.router;
  }
}

export const versionRoutes: VersionRoutes = new VersionRoutes();
