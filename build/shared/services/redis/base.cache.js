"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCache = void 0;
const config_1 = require("../../../config");
const connection_1 = require("./connection");
class BaseCache {
    constructor(cacheName) {
        this.log = config_1.config.createLogger(cacheName);
        this.client = connection_1.RedisSingleton.getInstance().client;
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
