import express, { Express } from 'express';
import { SnapShopServer } from '@root/server';
import { config } from '@root/config';
import dbConnection from '@root/setupDb';
import Logger from 'bunyan';

const log: Logger = config.createLogger('app');

class Application {
  public init(): void {
    this.loadConfig();
    dbConnection();

    const app: Express = express();
    const server: SnapShopServer = new SnapShopServer(app);
    server.start();
    Application.handleExit();
  }

  public loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
    config.twilioConfig();
  }

  private static handleExit(): void {
    process.on('uncaughtException', (error: Error) => {
      log.error(`There was an uncaught error: ${error}`);
      Application.shutDownProperly(1);
    });

    process.on('unhandledRejection', (reason: Error) => {
      log.error(`Unhandled reject at promise: ${reason}`);
      Application.shutDownProperly(2);
    });

    process.on('SIGTERM', () => {
      log.error('Caught SIGTERM');
      Application.shutDownProperly(1);
    });

    process.on('exit', () => {
      log.error('Exiting...');
    });
  }

  private static shutDownProperly(exitCode: number): void {
    Promise.resolve()
      .then(() => {
        log.info('Shutdown complete');
        process.exit(exitCode);
      })
      .catch((error) => {
        log.error(`Error during shutdown: ${error}`);
        process.exit(1);
      });
  }
}

const application: Application = new Application();
application.init();
