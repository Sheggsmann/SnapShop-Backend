"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCache = void 0;
const redis_1 = require("redis");
const config_1 = require("../../../config");
class BaseCache {
    constructor(cacheName) {
        this.log = config_1.config.createLogger(cacheName);
        try {
            this.client = (0, redis_1.createClient)({ url: config_1.config.REDIS_HOST });
            this.cacheError();
        }
        catch (err) {
            this.log.error(err);
            process.exit(1);
        }
    }
    cacheError() {
        this.client.on('error', (error) => {
            this.log.error(error);
        });
    }
}
exports.BaseCache = BaseCache;
