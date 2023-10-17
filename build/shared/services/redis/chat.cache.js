"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatCache = void 0;
const base_cache_1 = require("./base.cache");
const CACHE_NAME = 'ChatCache';
class ChatCache extends base_cache_1.BaseCache {
    constructor() {
        super(CACHE_NAME);
    }
    async userIsOnline(userId) {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
        await this.client.sAdd('online_users', userId);
    }
    async userIsOffline(userId) {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
        await this.client.sRem('online_users', userId);
    }
}
exports.ChatCache = ChatCache;
