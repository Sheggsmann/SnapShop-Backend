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
exports.updateStore = void 0;
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary_upload");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const store_service_1 = require("../../../shared/services/db/store.service");
const store_queue_1 = require("../../../shared/services/queues/store.queue");
const store_scheme_1 = require("../schemes/store.scheme");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Update {
    store(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            const { name, description, bgImage, image } = req.body;
            const store = yield store_service_1.storeService.getStoreByStoreId(storeId);
            if (!store)
                throw new error_handler_1.NotFoundError('Store not found');
            if (!store.isOwner(req.currentUser.userId))
                throw new error_handler_1.NotAuthorizedError('You are not the owner of this store');
            // Upload Images if they are images
            let imageResult = {};
            if (image) {
                imageResult = (yield (0, cloudinary_upload_1.uploadFile)(image, true, true, 'store'));
                if (!imageResult.secure_url)
                    throw new error_handler_1.BadRequestError(imageResult.message);
            }
            let bgImageResult = {};
            if (bgImage) {
                bgImageResult = (yield (0, cloudinary_upload_1.uploadFile)(bgImage, true, true, 'storeBg'));
                if (!bgImageResult.secure_url)
                    throw new error_handler_1.BadRequestError(bgImageResult.message);
            }
            const updatedStore = {
                name,
                description,
                image: image ? imageResult.secure_url : store.image,
                bgImage: bgImage ? bgImageResult.secure_url : store.bgImage
            };
            store_queue_1.storeQueue.addStoreJob('updateStoreInDB', { value: updatedStore, key: storeId });
            res.status(http_status_codes_1.default.OK).json({ message: 'Store updated successfully.', updatedStore });
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { storeId } = req.params;
            const store = yield store_service_1.storeService.getStoreByStoreId(storeId);
            if (!store)
                throw new error_handler_1.NotFoundError('Store not found');
            const updatedStore = {
                verified: true
            };
            store_queue_1.storeQueue.addStoreJob('updateStoreInDB', { key: storeId, value: updatedStore });
            res.status(http_status_codes_1.default.OK).json({ message: 'Store verified successfully' });
        });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(store_scheme_1.storeUpdateSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "store", null);
exports.updateStore = new Update();