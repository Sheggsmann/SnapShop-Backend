import { Request, Response, NextFunction, Application, json, urlencoded } from 'express';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { config } from '@root/config';
import { RedisSingleton } from '@service/redis/connection';
import { CustomError, IErrorResponse } from '@global/helpers/error-handler';
import { SocketIOChatHandler } from '@socket/chat';
import { BaseCronJob } from '@cronJobs/base.cron';
import applicationRoutes from '@root/routes';
import apiStats from 'swagger-stats';
import http from 'http';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import mongosanitize from 'express-mongo-sanitize';
import compression from 'compression';
import Logger from 'bunyan';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';

const log: Logger = config.createLogger('server');

export class SnapShopServer extends RedisSingleton {
  private app: Application;

  constructor(app: Application) {
    super();
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.apiMonitoring(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.use(hpp());
    app.use(helmet());
    app.use(mongosanitize());
    app.use(
      cors({
        origin: '*',
        credentials: true
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  private routeMiddleware(app: Application): void {
    applicationRoutes(app);
  }

  private apiMonitoring(app: Application): void {
    app.use(apiStats.getMiddleware({ uriPath: '/api-monitoring' }));
  }

  private globalErrorHandler(app: Application): void {
    app.all('*', (req: Request, res: Response) => {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
    });

    app.use((err: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.error(err);
      if (err instanceof CustomError) {
        return res.status(err.statusCode).json(err.serializeErrors());
      }
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    if (!config.JWT_TOKEN) throw new Error('JWT_TOKEN must be provided');
    try {
      const httpServer: http.Server = http.createServer(app);
      const socketIo: Server = await this.createSocketIO(httpServer);

      this.startHttpServer(httpServer);
      this.socketIOConnections(socketIo);
      this.startCronJobs();
    } catch (err) {
      log.error(err);
    }
  }

  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      }
    });

    const pubClient = this.client;
    const subClient = pubClient.duplicate();

    if (!pubClient.isOpen) {
      try {
        await Promise.all([pubClient.connect(), subClient.connect()]);
        log.info('Successfully connected to REDIS!');
      } catch (err) {
        log.error('Failed to connect to Redis:', err);
        process.exit();
      }
    }

    io.adapter(createAdapter(pubClient, subClient));

    process.on('beforeExit', () => {
      log.debug('CLOSING REDIS CONNECTION');
      pubClient.quit();
      subClient.quit();
      process.exit();
    });

    process.on('SIGINT', () => {
      log.debug('CLOSING REDIS CONNECTION');
      pubClient.quit();
      subClient.quit();
      process.exit();
    });

    return io;
  }

  private socketIOConnections(io: Server): void {
    const chatSocketHandler: SocketIOChatHandler = new SocketIOChatHandler(io);
    chatSocketHandler.listen();
  }

  private startHttpServer(httpServer: http.Server): void {
    log.info(`NODE ENV: ${config.NODE_ENV}`);
    log.info(`Worker with process id of ${process.pid} has started...`);
    log.info(`Server has started with ${process.pid}`);

    if (config.NODE_ENV === 'development') {
      httpServer.listen(config.SERVER_PORT, () => {
        log.info(`Server running on PORT: ${config.SERVER_PORT}`);
      });
    } else {
      httpServer.listen(config.SERVER_PORT, '0.0.0.0', () => {
        log.info(`Server running on PORT:${config.SERVER_PORT}`);
      });
    }
  }

  private startCronJobs(): void {
    log.info('STARTING CRON JOBS');
    BaseCronJob.startAllJobs();
  }
}
