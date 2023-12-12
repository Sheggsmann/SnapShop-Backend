"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCache = exports.RedisSingleton = void 0;
const redis_1 = require("redis");
const config_1 = require("../../../config");
class RedisSingleton {
    constructor() {
        this.client = (0, redis_1.createClient)({ url: config_1.config.REDIS_HOST });
        this.cacheError();
    }
    static getInstance() {
        if (!RedisSingleton.instance) {
            RedisSingleton.instance = new RedisSingleton();
        }
        return RedisSingleton.instance;
    }
    cacheError() {
        this.client.on('error', (error) => {
            console.error(error);
        });
    }
}
exports.RedisSingleton = RedisSingleton;
class BaseCache {
    constructor(cacheName) {
        this.log = config_1.config.createLogger(cacheName);
        this.client = RedisSingleton.getInstance().client;
        // try {
        //   this.client = createClient({ url: config.REDIS_HOST });
        //   this.cacheError();
        // } catch (err) {
        //   this.log.error(err);
        //   process.exit(1);
        // }
    }
}
exports.BaseCache = BaseCache;
