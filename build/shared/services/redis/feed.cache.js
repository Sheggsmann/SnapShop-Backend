"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedCache = void 0;
const base_cache_1 = require("./base.cache");
const config_1 = require("../../../config");
const error_handler_1 = require("../../globals/helpers/error-handler");
const CACHE_NAME = 'FeedCache';
const logger = config_1.config.createLogger(CACHE_NAME);
const ONE_HOUR_TTL = 60 * 60;
const THIRTY_MINS_TTL = 60 * 30;
class FeedCache extends base_cache_1.BaseCache {
    constructor() {
        super(CACHE_NAME);
    }
    async getProductsByDeviceId(deviceId) {
        try {
            if (!this.client.isOpen)
                await this.client.connect();
            const cachedData = await this.client.get(`exploreProducts:${deviceId}`);
            if (cachedData)
                return JSON.parse(cachedData);
            return [];
        }
        catch (err) {
            logger.error(err);
            throw new error_handler_1.ServerError('Server Error, Try Again.');
        }
    }
    async mapProductIdsToDeviceId(deviceId, products) {
        try {
            if (!this.client.isOpen)
                await this.client.connect();
            const productIds = products.map((product) => product._id);
            const shownProductIds = await this.getProductsByDeviceId(deviceId);
            await this.client.setEx(`exploreProducts:${deviceId}`, THIRTY_MINS_TTL, JSON.stringify([...shownProductIds, ...productIds]));
        }
        catch (err) {
            logger.error(err);
            throw new error_handler_1.ServerError('Server Error, Try Again.');
        }
    }
    async saveFeedDataToCache(userId, feedData) {
        try {
            if (!this.client.isOpen)
                await this.client.connect();
            await this.client.setEx(`feed:${userId}`, ONE_HOUR_TTL, JSON.stringify(feedData));
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
