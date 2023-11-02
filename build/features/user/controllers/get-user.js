"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const store_service_1 = require("../../../shared/services/db/store.service");
const user_service_1 = require("../../../shared/services/db/user.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async me(req, res) {
        let user = null;
        let store = null;
        user = await user_service_1.userService.getUserById(req.currentUser.userId);
        store = await store_service_1.storeService.getStoreByStoreId(req.currentUser.storeId);
        if (!user && !store) {
            throw new error_handler_1.BadRequestError('Details not found');
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'User profile', user, store });
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
        const user = await (await user_service_1.userService.getUserById(req.currentUser.userId)).populate('likedProducts', '-locations');
        res.status(http_status_codes_1.default.OK).json({ message: 'Liked products', likedProducts: user.likedProducts });
    }
}
exports.getUser = new Get();
