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
exports.updateStore = void 0;
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary_upload");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const store_service_1 = require("../../../shared/services/db/store.service");
const store_queue_1 = require("../../../shared/services/queues/store.queue");
const store_scheme_1 = require("../schemes/store.scheme");
const user_scheme_1 = require("../../user/schemes/user.scheme");
const store_constant_1 = require("../constants/store.constant");
const product_service_1 = require("../../../shared/services/db/product.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Update {
    async store(req, res) {
        const { storeId } = req.params;
        const { name, description, bgImage, image, email } = req.body;
        const store = await store_service_1.storeService.getStoreByStoreId(storeId);
        if (!store)
            throw new error_handler_1.NotFoundError('Store not found');
        if (!store.isOwner(req.currentUser.userId))
            throw new error_handler_1.NotAuthorizedError('You are not the owner of this store');
        if (email) {
            const emailStore = await store_service_1.storeService.getStoreByEmail(email.trim());
            if (emailStore && email.trim().toLowerCase() !== store.email?.toLowerCase()) {
                throw new error_handler_1.BadRequestError('Email already in use.');
            }
        }
        // Upload Images if they are images
        let imageResult = {};
        if (image) {
            imageResult = (await (0, cloudinary_upload_1.uploadFile)(image, true, true, 'store'));
            if (!imageResult.secure_url)
                throw new error_handler_1.BadRequestError(imageResult.message);
        }
        let bgImageResult = {};
        if (bgImage) {
            bgImageResult = (await (0, cloudinary_upload_1.uploadFile)(bgImage, true, true, 'storeBg'));
            if (!bgImageResult.secure_url)
                throw new error_handler_1.BadRequestError(bgImageResult.message);
        }
        const updatedStore = {
            name: name ? name : store.name,
            description: description ? description : store.description,
            image: image ? imageResult.secure_url : store.image,
            bgImage: bgImage ? bgImageResult.secure_url : store.bgImage,
            email: email ? email : store?.email
        };
        store_queue_1.storeQueue.addStoreJob('updateStoreInDB', { value: updatedStore, key: storeId });
        res.status(http_status_codes_1.default.OK).json({ message: 'Store updated successfully.', updatedStore });
    }
    async storeLocation(req, res) {
        const { storeId } = req.params;
        const { latlng, address } = req.body;
        const [lat, lng] = latlng.split(',');
        const store = await store_service_1.storeService.getStoreByStoreId(storeId);
        if (!store)
            throw new error_handler_1.NotFoundError('Store not found');
        if (!store.isOwner(req.currentUser.userId))
            throw new error_handler_1.NotAuthorizedError('You are not the owner of this store');
        // You can only update store once in 30 days unless you are a pro-user
        if (store.locationUpdatedAt &&
            Date.now() - (store.locationUpdatedAt || 0) < store_constant_1.storeConstants.LOCATION_UPDATE_INTERVAL_IN_MS) {
            throw new error_handler_1.BadRequestError('You cannot update your store location now. Wait 30 days or consider a pro plan');
        }
        store.locations = [
            { location: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, address }
        ];
        store.locationUpdatedAt = Date.now();
        store_queue_1.storeQueue.addStoreJob('updateStoreInDB', { value: store, key: storeId });
        res.status(http_status_codes_1.default.OK).json({ message: 'Location updated successfully' });
    }
    async verify(req, res) {
        const { storeId } = req.params;
        const store = await store_service_1.storeService.getStoreByStoreId(storeId);
        if (!store)
            throw new error_handler_1.NotFoundError('Store not found');
        const updatedStore = {
            verified: true
        };
        store_queue_1.storeQueue.addStoreJob('updateStoreInDB', { key: storeId, value: updatedStore });
        res.status(http_status_codes_1.default.OK).json({ message: 'Store verified successfully' });
    }
    async savePushNotificationToken(req, res) {
        const { pushToken } = req.body;
        const updatedStore = { expoPushToken: pushToken };
        store_queue_1.storeQueue.addStoreJob('updateStoreInDB', { key: req.currentUser.storeId, value: updatedStore });
        res.status(http_status_codes_1.default.OK).json({ message: 'PushToken saved successfully' });
    }
    async productCategory(req, res) {
        let { oldCategory, newCategory } = req.body;
        oldCategory = oldCategory.toLowerCase().trim();
        newCategory = newCategory.toLowerCase().trim();
        if (oldCategory === newCategory)
            throw new error_handler_1.BadRequestError('Category names are the same');
        const store = await store_service_1.storeService.getStoreByStoreId(`${req.currentUser.storeId}`);
        if (!store)
            throw new error_handler_1.NotFoundError('Store not found');
        // Return 400 if the new category exists in any of the product categories
        if (store.productCategories.find((category) => category.trim().toLowerCase() === newCategory))
            throw new error_handler_1.BadRequestError('Category already exists');
        // Replace the old category in the store.productCategories with the oldCategory
        const categoryId = store.productCategories.findIndex((category) => category.trim().toLowerCase() === oldCategory);
        if (categoryId > -1) {
            store.productCategories[categoryId] = newCategory;
            await store_service_1.storeService.updateStore(`${req.currentUser.storeId}`, store);
            await product_service_1.productService.updateStoreProductsCategories(`${req.currentUser.storeId}`, oldCategory, newCategory);
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'Category updated successfully', store });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(store_scheme_1.storeUpdateSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "store", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(store_scheme_1.storeLocationUpdateSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "storeLocation", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(user_scheme_1.savePushTokenSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "savePushNotificationToken", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(store_scheme_1.updateProductCategorySchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "productCategory", null);
exports.updateStore = new Update();
