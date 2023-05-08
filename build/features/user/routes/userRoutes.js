"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const get_user_1 = require("../controllers/get-user");
const update_user_1 = require("../controllers/update-user");
class UserRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/me', auth_middleware_1.authMiddleware.checkAuth, get_user_1.getUser.me);
        this.router.get('/user/saved-stores', auth_middleware_1.authMiddleware.checkAuth, get_user_1.getUser.savedStores);
        this.router.get('/user/liked-products', auth_middleware_1.authMiddleware.checkAuth, get_user_1.getUser.likedProducts);
        this.router.get('/profile/:userId', auth_middleware_1.authMiddleware.checkAuth, get_user_1.getUser.profile);
        this.router.put('/user', auth_middleware_1.authMiddleware.checkAuth, update_user_1.updateUser.user);
        this.router.post('/user/like-product', auth_middleware_1.authMiddleware.checkAuth, update_user_1.updateUser.likeProduct);
        this.router.post('/user/save-store', auth_middleware_1.authMiddleware.checkAuth, update_user_1.updateUser.saveStore);
        return this.router;
    }
}
exports.userRoutes = new UserRoutes();
