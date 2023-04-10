import express, { Express } from 'express';
import { SnapShopServer } from './server';
import { config } from './config';
import dbConnection from './setupDb';

class Application {
  public init(): void {
    this.loadConfig();
    dbConnection();

    const app: Express = express();
    const server: SnapShopServer = new SnapShopServer(app);
    server.start();
  }

  public loadConfig(): void {
    config.validateConfig();
  }
}

const application: Application = new Application();
application.init();
