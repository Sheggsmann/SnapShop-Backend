"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapShopServer = void 0;
const express_1 = require("express");
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const config_1 = require("./config");
const error_handler_1 = require("./shared/globals/helpers/error-handler");
const chat_1 = require("./shared/sockets/chat");
const routes_1 = __importDefault(require("./routes"));
const swagger_stats_1 = __importDefault(require("swagger-stats"));
const http_1 = __importDefault(require("http"));
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const compression_1 = __importDefault(require("compression"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
require("express-async-errors");
const log = config_1.config.createLogger('server');
class SnapShopServer {
    constructor(app) {
        this.app = app;
    }
    start() {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routeMiddleware(this.app);
        this.apiMonitoring(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
    }
    securityMiddleware(app) {
        app.use((0, hpp_1.default)());
        app.use((0, helmet_1.default)());
        app.use((0, express_mongo_sanitize_1.default)());
        app.use((0, cors_1.default)({
            origin: '*',
            credentials: true
        }));
    }
    standardMiddleware(app) {
        app.use((0, compression_1.default)());
        app.use((0, express_1.json)({ limit: '50mb' }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    }
    routeMiddleware(app) {
        (0, routes_1.default)(app);
    }
    apiMonitoring(app) {
        app.use(swagger_stats_1.default.getMiddleware({ uriPath: '/api-monitoring' }));
    }
    globalErrorHandler(app) {
        app.all('*', (req, res) => {
            res.status(http_status_codes_1.default.NOT_FOUND).json({ message: `${req.originalUrl} not found` });
        });
        app.use((err, req, res, next) => {
            log.error(err);
            if (err instanceof error_handler_1.CustomError) {
                return res.status(err.statusCode).json(err.serializeErrors());
            }
            next();
        });
    }
    async startServer(app) {
        if (!config_1.config.JWT_TOKEN)
            throw new Error('JWT_TOKEN must be provided');
        try {
            const httpServer = http_1.default.createServer(app);
            const socketIo = await this.createSocketIO(httpServer);
            this.startHttpServer(httpServer);
            this.socketIOConnections(socketIo);
        }
        catch (err) {
            log.error(err);
        }
    }
    async createSocketIO(httpServer) {
        const io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'DELETE']
            }
        });
        const pubClient = (0, redis_1.createClient)({ url: config_1.config.REDIS_HOST });
        const subClient = pubClient.duplicate();
        if (!pubClient.isOpen) {
            await Promise.all([pubClient.connect(), subClient.connect()]);
        }
        io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
        process.on('beforeExit', () => {
            log.debug('CLOSING REDIS CONNECTION');
            pubClient.quit();
            subClient.quit();
        });
        return io;
    }
    socketIOConnections(io) {
        const chatSocketHandler = new chat_1.SocketIOChatHandler(io);
        chatSocketHandler.listen();
    }
    startHttpServer(httpServer) {
        log.info(`NODE ENV: ${config_1.config.NODE_ENV}`);
        log.info(`Worker with process id of ${process.pid} has started...`);
        log.info(`Server has started with ${process.pid}`);
        if (config_1.config.NODE_ENV === 'development') {
            httpServer.listen(config_1.config.SERVER_PORT, () => {
                log.info(`Server running on PORT: ${config_1.config.SERVER_PORT}`);
            });
        }
        else {
            httpServer.listen(config_1.config.SERVER_PORT, '0.0.0.0', () => {
                log.info(`Server running on PORT:${config_1.config.SERVER_PORT}`);
            });
        }
    }
}
exports.SnapShopServer = SnapShopServer;
