"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const user_service_1 = require("../../../shared/services/db/user.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_service_1.userService.getUserById(req.currentUser.userId);
            if (!user)
                throw new error_handler_1.NotFoundError('Account not found');
            res.status(http_status_codes_1.default.OK).json({ message: 'User profile', user });
        });
    }
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            const user = yield user_service_1.userService.getUserById(userId);
            if (!user)
                throw new error_handler_1.NotFoundError('Account not found');
            res.status(http_status_codes_1.default.OK).json({ message: 'User Profile', user });
        });
    }
    savedStores(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (yield user_service_1.userService.getUserById(req.currentUser.userId)).populate('savedStores', '-owner');
            res.status(http_status_codes_1.default.OK).json({ message: 'Saved stores', savedStores: user.savedStores });
        });
    }
    likedProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (yield user_service_1.userService.getUserById(req.currentUser.userId)).populate('likedProducts', '-locations');
            res.status(http_status_codes_1.default.OK).json({ message: 'Liked products', likedProducts: user.likedProducts });
        });
    }
}
exports.getUser = new Get();
