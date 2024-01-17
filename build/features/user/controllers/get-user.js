"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const product_service_1 = require("../../../shared/services/db/product.service");
const store_service_1 = require("../../../shared/services/db/store.service");
const user_service_1 = require("../../../shared/services/db/user.service");
const feed_cache_1 = require("../../../shared/services/redis/feed.cache");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const feedCache = new feed_cache_1.FeedCache();
class Get {
    async me(req, res) {
        const user = await user_service_1.userService.getUserById(req.currentUser.userId);
        if (!user) {
            throw new error_handler_1.BadRequestError('Details not found');
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'User profile', user });
    }
    async guestFeed(req, res) {
        if (!req.query.latitude || !req.query.longitude)
            throw new error_handler_1.BadRequestError('Latitude and Longitude are required');
        const lat = parseFloat(req.query.latitude);
        const long = parseFloat(req.query.longitude);
        const feedData = [];
        const closestStores = await store_service_1.storeService.getClosestStores([long, lat], 10);
        const frequentlyPurchasedProducts = await product_service_1.productService.getFrequentlyPurchasedProductsNearUser([long, lat], 10);
        feedData.push({
            title: 'Stores close to you',
            subtitle: 'Based on your location',
            content: closestStores
        });
        feedData.push({
            title: 'Frequently purchased',
            subtitle: 'Close to you',
            content: frequentlyPurchasedProducts
        });
        res.status(http_status_codes_1.default.OK).json({ message: 'Feed', feed: feedData });
    }
    async feed(req, res) {
        if (!req.query.latitude || !req.query.longitude)
            throw new error_handler_1.BadRequestError('Latitude and Longitude are required');
        const lat = parseFloat(req.query.latitude);
        const long = parseFloat(req.query.longitude);
        const feedData = [];
        // Check if data exists in cache
        const cachedData = await feedCache.getFeedData(req.currentUser.userId);
        if (cachedData && cachedData[0]['content'].length > 0) {
            res.status(http_status_codes_1.default.OK).json({ message: 'Feed', feed: cachedData });
        }
        else {
            const closestStores = await store_service_1.storeService.getClosestStores([long, lat], 10);
            const frequentlyPurchasedProducts = await product_service_1.productService.getFrequentlyPurchasedProductsNearUser([long, lat], 10);
            feedData.push({
                title: 'Stores close to you',
                subtitle: 'Based on your location',
                content: closestStores
            });
            feedData.push({
                title: 'Frequently purchased',
                subtitle: 'Close to you',
                content: frequentlyPurchasedProducts
            });
            if (feedData.length) {
                await feedCache.saveFeedDataToCache(req.currentUser.userId, feedData);
            }
            res.status(http_status_codes_1.default.OK).json({ message: 'Feed', feed: feedData });
        }
    }
    async auth(req, res) {
        const { userId } = req.params;
        const user = await user_service_1.userService.getUserById(userId);
        if (!user) {
            throw new error_handler_1.BadRequestError('Details not found');
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'User Auth', user });
    }
    async profile(req, res) {
        const { userId } = req.params;
        const user = await user_service_1.userService.getUserById(userId);
        if (!user)
            throw new error_handler_1.NotFoundError('Account not found');
        res.status(http_status_codes_1.default.OK).json({ message: 'User Profile', user });
    }
    async savedStores(req, res) {
        const user = await (await user_service_1.userService.getUserById(req.currentUser.userId)).populate('savedStores', '-owner');
        res.status(http_status_codes_1.default.OK).json({ message: 'Saved stores', savedStores: user.savedStores });
    }
    async likedProducts(req, res) {
        const user = await (await (await user_service_1.userService.getUserById(req.currentUser.userId)).populate('likedProducts', '-locations')).populate('likedProducts.store', '_id name image bgImage');
        res.status(http_status_codes_1.default.OK).json({ message: 'Liked products', likedProducts: user.likedProducts });
    }
}
exports.getUser = new Get();
