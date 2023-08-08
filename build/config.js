"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const bunyan_1 = __importDefault(require("bunyan"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const twilio_1 = __importDefault(require("twilio"));
dotenv_1.default.config({});
class Config {
    constructor() {
        this.DEFAULT_DATABSE_URL = 'mongodb://localhost:27017/snapshop-backend';
        this.PORT = 5000;
        this.DATABASE_URL = process.env.DATABASE_URL || this.DEFAULT_DATABSE_URL;
        this.SERVER_PORT = process.env.PORT ? parseInt(process.env.PORT) : '' || this.PORT;
        this.JWT_TOKEN = process.env.JWT_TOKEN || 'promisehasarandomjwttoken';
        this.NODE_ENV = process.env.NODE_ENV || '';
        this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
        this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
        this.REDIS_HOST = process.env.REDIS_HOST || '';
        this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || '';
        this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
        this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
        this.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
        this.TWILIO_SID = process.env.TWILIO_SID || '';
        this.TWILIO_NUMBER = process.env.TWILIO_NUMBER || '';
        this.TWILIO_WHATSAPP = process.env.TWILIO_WHATSAPP || '';
        this.TERMII_API_KEY = process.env.TERMII_API_KEY || '';
        this.TERMII_SECRET_KEY = process.env.TERMII_SECRET_KEY || '';
        this.TERMII_URL = process.env.TERMII_URL || '';
    }
    validateConfig() {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined) {
                throw new Error(`Configuration ${key} is undefined.`);
            }
        }
    }
    cloudinaryConfig() {
        cloudinary_1.default.v2.config({
            api_key: exports.config.CLOUDINARY_API_KEY,
            api_secret: exports.config.CLOUDINARY_API_SECRET,
            cloud_name: exports.config.CLOUDINARY_NAME
        });
    }
    twilioConfig() {
        return (0, twilio_1.default)(exports.config.TWILIO_SID, exports.config.TWILIO_AUTH_TOKEN);
    }
    createLogger(name) {
        return bunyan_1.default.createLogger({ name, level: 'debug' });
    }
}
exports.config = new Config();
