"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisSingleton = void 0;
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
            console.error('\n\nREDIS ERROR:', error);
        });
    }
    async lock(lockKey) {
        const result = await this.client.setNX(lockKey, '1');
        return result;
    }
    async unlock(lockKey) {
        await this.client.del(lockKey);
    }
}
exports.RedisSingleton = RedisSingleton;
