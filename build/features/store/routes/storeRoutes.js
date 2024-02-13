"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const create_store_1 = require("../controllers/create-store");
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const get_store_1 = require("../controllers/get-store");
const update_store_1 = require("../controllers/update-store");
const share_store_1 = require("../controllers/share-store");
class StoreRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/store/me', auth_middleware_1.authMiddleware.checkAuth, get_store_1.getStores.myStore);
        this.router.get('/store/product-categories', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), get_store_1.getStores.productCategories);
        this.router.get('/store/products', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), get_store_1.getStores.products);
        this.router.get('/stores/:storeId', auth_middleware_1.authMiddleware.checkAuth, get_store_1.getStores.storeByStoreId);
        this.router.get('/store/:storeId/link', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), share_store_1.shareStore.getSlugLink);
        this.router.put('/stores/verify/:storeId', auth_middleware_1.authMiddleware.checkAuth, update_store_1.updateStore.verify);
        this.router.put('/stores/:storeId', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), update_store_1.updateStore.store);
        this.router.put('/stores/:storeId/updateLocation', auth_middleware_1.authMiddleware.checkAuth, update_store_1.updateStore.storeLocation);
        this.router.put('/store/product-categories', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), update_store_1.updateStore.productCategory);
        this.router.post('/store/signup', auth_middleware_1.authMiddleware.checkAuth, create_store_1.createStore.store);
        this.router.post('/store/:storeId/slug', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), share_store_1.shareStore.createStoreSlug);
        this.router.post('/store/store-expo-push-token', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), update_store_1.updateStore.savePushNotificationToken);
        this.router.post('/store/product-categories', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), create_store_1.createStore.productCategory);
        return this.router;
    }
}
exports.storeRoutes = new StoreRoutes();
