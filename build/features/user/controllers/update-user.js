"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = void 0;
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary_upload");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const user_service_1 = require("../../../shared/services/db/user.service");
const user_queue_1 = require("../../../shared/services/queues/user.queue");
const user_scheme_1 = require("../schemes/user.scheme");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Update {
    async user(req, res) {
        const { email, image } = req.body;
        const user = await user_service_1.userService.getUserById(req.currentUser.userId);
        if (!user)
            throw new error_handler_1.NotFoundError('User not found');
        // Upload Images if they are images
        let imageResult = {};
        if (image) {
            imageResult = (await (0, cloudinary_upload_1.uploadFile)(image, true, true, 'user'));
            if (!imageResult.secure_url)
                throw new error_handler_1.BadRequestError(imageResult.message);
        }
        const updatedUser = {
            profilePicture: image ? imageResult.secure_url : user.profilePicture,
            email
        };
        user_queue_1.userQueue.addUserJob('updateUserInDB', { key: req.currentUser.userId, value: updatedUser });
        res.status(http_status_codes_1.default.OK).json({ message: 'User updated successfully', updatedUser });
    }
    /**
     * @param
     * @desc defines an endpoint to save/unsave a store
     */
    async saveStore(req, res) {
        const { storeId } = req.body;
        const user = await user_service_1.userService.getUserById(req.currentUser.userId);
        let newSavedStores = [];
        if (user.savedStores.includes(storeId)) {
            newSavedStores = user.savedStores.filter((sId) => sId.toString() !== storeId);
        }
        else {
            newSavedStores = [...user.savedStores, storeId];
        }
        const updatedUser = {
            savedStores: newSavedStores
        };
        user_queue_1.userQueue.addUserJob('updateUserInDB', { key: req.currentUser.userId, value: updatedUser });
        res
            .status(http_status_codes_1.default.OK)
            .json({ message: 'Store saved successfully', savedStores: updatedUser.savedStores });
    }
    /**
     * @param
     * @desc defines an endpoint to like or unlike a product
     */
    async likeProduct(req, res) {
        const { productId } = req.body;
        const user = await user_service_1.userService.getUserById(req.currentUser.userId);
        let newLikedProducts = [];
        if (user.likedProducts.includes(productId)) {
            newLikedProducts = user.likedProducts.filter((pId) => pId.toString() !== productId);
        }
        else {
            newLikedProducts = [...user.likedProducts, productId];
        }
        const updatedUser = {
            likedProducts: newLikedProducts
        };
        user_queue_1.userQueue.addUserJob('updateUserInDB', { key: req.currentUser.userId, value: updatedUser });
        res
            .status(http_status_codes_1.default.OK)
            .json({ message: 'Product liked successfully', likedProducts: updatedUser.likedProducts });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(user_scheme_1.userSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "user", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(user_scheme_1.saveStoreSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "saveStore", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(user_scheme_1.likedProductSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "likeProduct", null);
exports.updateUser = new Update();
