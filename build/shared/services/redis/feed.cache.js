"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedCache = void 0;
const base_cache_1 = require("./base.cache");
const config_1 = require("../../../config");
const error_handler_1 = require("../../globals/helpers/error-handler");
const CACHE_NAME = 'FeedCache';
const logger = config_1.config.createLogger(CACHE_NAME);
class FeedCache extends base_cache_1.BaseCache {
    constructor() {
        super(CACHE_NAME);
    }
    async saveFeedDataToCache(userId, feedData) {
        try {
            if (!this.client.isOpen)
                await this.client.connect();
            await this.client.setEx(`feed:${userId}`, 60 * 60 * 1, JSON.stringify(feedData));
        }
        catch (err) {
            logger.error(err);
            throw new error_handler_1.ServerError('Server Error, Try Again.');
        }
    }
    async getFeedData(userId) {
        try {
            if (!this.client.isOpen)
                await this.client.connect();
            const cachedData = await this.client.get(`feed:${userId}`);
            if (cachedData) {
                return JSON.parse(cachedData);
            }
            return null;
        }
        catch (err) {
            logger.error(err);
            throw new error_handler_1.ServerError('Server Error, Try Again.');
        }
    }
}
exports.FeedCache = FeedCache;
