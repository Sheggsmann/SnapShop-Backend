"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConnection = void 0;
const config_1 = require("../../../config");
const base_cache_1 = require("./base.cache");
const log = config_1.config.createLogger('redisConnection');
class RedisConnection extends base_cache_1.BaseCache {
    constructor() {
        super('redisConnection');
    }
    async connect() {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
                const res = await this.client.ping();
                if (res === 'PONG')
                    log.info('Successfully connected to REDIS');
            }
        }
        catch (err) {
            log.error(err);
        }
    }
}
exports.redisConnection = new RedisConnection();
