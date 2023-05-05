"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const logger = config_1.config.createLogger('setupDatabase');
exports.default = () => {
    const connect = () => {
        mongoose_1.default
            .connect(`${config_1.config.DATABASE_URL}`)
            .then(() => logger.info('Successfully connected to the database'))
            .catch((err) => {
            logger.error('Error connecting to database', err);
            return process.exit(1);
        });
    };
    connect();
    mongoose_1.default.connection.on('disconnected', connect);
};
