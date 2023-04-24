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
exports.updateProduct = void 0;
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const product_scheme_1 = require("../schemes/product.scheme");
const product_service_1 = require("../../../shared/services/db/product.service");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const product_queue_1 = require("../../../shared/services/queues/product.queue");
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary_upload");
const product_constants_1 = require("../constants/product.constants");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
/* When updating a product, the images and videos are passed as an array of image/video files with the
following format.

[
  { public_id: '', content: 'base64:2ekfro },.
  { public_id: '', content: 'base64:3043jf' }
]

the 'public_id' is used to tell cloudinary what file to invalidate to ensure
our storage space over-utilized
*/
class Update {
    product(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            const { name, description, price, priceDiscount, quantity, category } = req.body;
            const product = yield product_service_1.productService.getProductById(productId);
            if (!product) {
                throw new error_handler_1.NotFoundError('Product not found');
            }
            if (product.store.owner.toString() !== req.currentUser.userId) {
                throw new error_handler_1.NotAuthorizedError('You are not the owner of this store');
            }
            const updatedProduct = {
                name,
                description,
                price,
                priceDiscount,
                quantity,
                category
            };
            product_queue_1.productQueue.addProductJob('updateProductInDB', { key: productId, value: updatedProduct });
            res.status(http_status_codes_1.default.OK).json({ message: 'Product updated successfully', updatedProduct });
        });
    }
    productWithMedia(req, res) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const { productId } = req.params;
            const { images, videos } = req.body;
            const product = yield product_service_1.productService.getProductById(productId);
            if (!product) {
                throw new error_handler_1.NotFoundError('Product not found');
            }
            if (product.store.owner.toString() !== req.currentUser.userId) {
                throw new error_handler_1.NotAuthorizedError('You are not the owner of this store');
            }
            // Check if images have exceeded the max image length
            const totalImages = product.images.length + ((_b = (_a = images === null || images === void 0 ? void 0 : images.uploaded) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) - ((_d = (_c = images === null || images === void 0 ? void 0 : images.deleted) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0);
            if (totalImages > product_constants_1.productConstants.MAX_PRODUCT_IMAGES) {
                throw new error_handler_1.BadRequestError('Max number of images is 5');
            }
            const newProductImages = [];
            // Delete all modified images
            if ((images === null || images === void 0 ? void 0 : images.deleted) && images.deleted.length) {
                const deletePromises = images.deleted.map((img_public_id) => (0, cloudinary_upload_1.deleteFile)(img_public_id));
                yield Promise.all(deletePromises);
            }
            if (images === null || images === void 0 ? void 0 : images.deleted) {
                for (const item of product.images) {
                    if (!images.deleted.find((public_id) => public_id === item.public_id)) {
                        newProductImages.push(item);
                    }
                }
            }
            else {
                newProductImages.push(...product.images);
            }
            // Upload new images to cloudinary
            const uploadedImages = [];
            if ((images === null || images === void 0 ? void 0 : images.uploaded) && images.uploaded.length) {
                const imagesToUpload = images.uploaded.map((img) => img.content);
                const imageResponses = (yield (0, cloudinary_upload_1.uploadMultiple)(imagesToUpload, 'image', true, true, product_constants_1.productConstants.PRODUCT_IMAGE_FOLDER));
                imageResponses.forEach((imgRes) => {
                    if (!imgRes.public_id) {
                        throw new error_handler_1.BadRequestError('An error occurred while uploading the images');
                    }
                    uploadedImages.push({ url: imgRes.secure_url, public_id: imgRes.public_id });
                });
            }
            newProductImages.push(...uploadedImages);
            // Upload videos if videos exist
            const uploadedVideos = [];
            if ((videos === null || videos === void 0 ? void 0 : videos.uploaded) && videos.uploaded.length) {
                const videosToUpload = videos.uploaded.map((vid) => vid.content);
                const videoResponses = (yield (0, cloudinary_upload_1.uploadMultiple)(videosToUpload, 'video', true, true, product_constants_1.productConstants.PRODUCT_VIDEO_FOLDER));
                videoResponses.forEach((vidRes) => {
                    if (!vidRes.public_id) {
                        throw new error_handler_1.BadRequestError('An error occurred while uploading video');
                    }
                    uploadedVideos.push({ url: vidRes.secure_url, public_id: vidRes.public_id });
                });
            }
            const updatedProduct = {
                images: newProductImages,
                videos: ((_e = videos === null || videos === void 0 ? void 0 : videos.uploaded) === null || _e === void 0 ? void 0 : _e.length) ? uploadedVideos : product.videos
            };
            product_queue_1.productQueue.addProductJob('updateProductInDB', { key: productId, value: updatedProduct });
            res.status(http_status_codes_1.default.OK).json({ message: 'Product updated successfully', updatedProduct });
        });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(product_scheme_1.updateProductSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "product", null);
__decorate([
    (0, joi_validation_decorator_1.validator)(product_scheme_1.updateProductMediaSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Update.prototype, "productWithMedia", null);
exports.updateProduct = new Update();
