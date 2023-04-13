import express, { Express } from 'express';
import { SnapShopServer } from '@root/server';
import { config } from '@root/config';
import dbConnection from '@root/setupDb';

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
    config.cloudinaryConfig();
    config.twilioConfig();
  }
}

const application: Application = new Application();
application.init();
