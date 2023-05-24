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
exports.createProduct = void 0;
const mongodb_1 = require("mongodb");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const product_scheme_1 = require("../schemes/product.scheme");
const cloudinary_upload_1 = require("../../../shared/globals/helpers/cloudinary_upload");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const product_queue_1 = require("../../../shared/services/queues/product.queue");
const product_constants_1 = require("../constants/product.constants");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Create {
    product(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { name, videos, description, images, price, priceDiscount, quantity, category } = req.body;
            if (!((_a = req.currentUser) === null || _a === void 0 ? void 0 : _a.storeId))
                throw new error_handler_1.BadRequestError("User doesn't own a store");
            const productObjectId = new mongodb_1.ObjectId();
            // Images upload
            const uploadedImages = [];
            const imageResponses = (yield (0, cloudinary_upload_1.uploadMultiple)(images, 'image', true, true, product_constants_1.productConstants.PRODUCT_IMAGE_FOLDER));
            imageResponses.forEach((imgRes) => {
                if (!imgRes.public_id) {
                    throw new error_handler_1.BadRequestError('An error occurred while uploading the images');
                }
                uploadedImages.push({ url: imgRes.secure_url, public_id: imgRes.public_id });
            });
            // Videos Upload
            const uploadedVideos = [];
            if (videos && videos.length) {
                uploadedVideos.push(...videos);
            }
            const product = {
                _id: productObjectId,
                name,
                description,
                price,
                category,
                images: uploadedImages,
                store: req.currentUser.storeId,
                videos: uploadedVideos,
                priceDiscount: priceDiscount !== null && priceDiscount !== void 0 ? priceDiscount : 0,
                quantity: quantity !== null && quantity !== void 0 ? quantity : 0
            };
            product_queue_1.productQueue.addProductJob('addProductToDB', { value: product, key: req.currentUser.storeId });
            res.status(http_status_codes_1.default.OK).json({ message: 'Product created successfully', product });
        });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(product_scheme_1.productSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Create.prototype, "product", null);
exports.createProduct = new Create();
