"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const get_user_1 = require("../controllers/get-user");
const delete_user_1 = require("../controllers/delete-user");
const update_user_1 = require("../controllers/update-user");
const config_1 = require("../../../config");
class UserRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/me', auth_middleware_1.authMiddleware.checkAuth, get_user_1.getUser.me);
        this.router.get('/user/feed', auth_middleware_1.authMiddleware.checkAuth, get_user_1.getUser.feed);
        this.router.get('/user/saved-stores', auth_middleware_1.authMiddleware.checkAuth, get_user_1.getUser.savedStores);
        this.router.get('/user/liked-products', auth_middleware_1.authMiddleware.checkAuth, get_user_1.getUser.likedProducts);
        this.router.get('/user/auth/:userId', auth_middleware_1.authMiddleware.checkAuth, get_user_1.getUser.auth);
        this.router.get('/profile/:userId', auth_middleware_1.authMiddleware.checkAuth, get_user_1.getUser.profile);
        this.router.put('/user', auth_middleware_1.authMiddleware.checkAuth, update_user_1.updateUser.user);
        this.router.post('/user/like-product', auth_middleware_1.authMiddleware.checkAuth, update_user_1.updateUser.likeProduct);
        this.router.post('/user/save-store', auth_middleware_1.authMiddleware.checkAuth, update_user_1.updateUser.saveStore);
        this.router.post('/user/store-expo-push-token', auth_middleware_1.authMiddleware.checkAuth, auth_middleware_1.authMiddleware.restrictTo(['User']), update_user_1.updateUser.savePushNotificationToken);
        if (config_1.config.NODE_ENV === 'development') {
            this.router.delete('/user/:userId', delete_user_1.deleteUser.user);
            this.router.post('/user/send-sms', update_user_1.updateUser.sendSms);
        }
        return this.router;
    }
}
exports.userRoutes = new UserRoutes();
