"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
const config_1 = require("./config");
const setupDb_1 = __importDefault(require("./setupDb"));
const log = config_1.config.createLogger('app');
class Application {
    init() {
        this.loadConfig();
        (0, setupDb_1.default)();
        const app = (0, express_1.default)();
        const server = new server_1.SnapShopServer(app);
        server.start();
        Application.handleExit();
    }
    loadConfig() {
        config_1.config.validateConfig();
        config_1.config.cloudinaryConfig();
        config_1.config.twilioConfig();
    }
    static handleExit() {
        process.on('uncaughtException', (error) => {
            log.error(`\nThere was an uncaught error: ${error}`);
            Application.shutDownProperly(1);
        });
        process.on('unhandledRejection', (reason) => {
            log.error(`\nUnhandled reject at promise: ${reason}`);
            Application.shutDownProperly(2);
        });
        process.on('SIGTERM', () => {
            log.error('Caught SIGTERM');
            Application.shutDownProperly(1);
        });
        process.on('SIGINT', () => {
            log.error('Caught SigInt');
            Application.shutDownProperly(1);
        });
        process.on('exit', () => {
            log.error('Exiting...');
        });
    }
    static shutDownProperly(exitCode) {
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
const application = new Application();
application.init();
