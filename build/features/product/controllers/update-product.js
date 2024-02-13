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


=== MODIFIED ===

The images are uploaded on the frontend, then an array of object containing the details from IProductFile
interface are being sent to the backend.

eg:
[
  { public_id: "", url: "https://youtu.be/953vyZMO4cM" }
]
*/
class Update {
    async product(req, res) {
        const { productId } = req.params;
        const { name, images, videos, description, price, priceDiscount, quantity, category, tags } = req.body;
        const product = await product_service_1.productService.getProductById(productId);
        if (!product) {
            throw new error_handler_1.NotFoundError('Product not found');
        }
        if (product.store.owner.toString() !== req.currentUser.userId) {
            throw new error_handler_1.NotAuthorizedError('You are not the owner of this store');
        }
        if (priceDiscount) {
            if (parseInt(priceDiscount) > parseInt(price) || parseInt(priceDiscount) > product.price)
                throw new error_handler_1.BadRequestError('Discount cannot be greater than price');
        }
        if (name)
            product.name = name;
        if (description)
            product.description = description;
        if (images)
            product.images = images;
        if (videos)
            product.videos = videos;
        if (price)
            product.price = price;
        if (priceDiscount)
            product.priceDiscount = priceDiscount;
        if (quantity)
            product.quantity = quantity;
        if (category)
            product.category = category;
        if (tags)
            product.tags = tags;
        await product.save();
        res.status(http_status_codes_1.default.OK).json({ message: 'Product updated successfully', updatedProduct: product });
    }
    async productWithMedia(req, res) {
        const { productId } = req.params;
        const { images, videos } = req.body;
        const product = await product_service_1.productService.getProductById(productId);
        if (!product) {
            throw new error_handler_1.NotFoundError('Product not found');
        }
        if (product.store.owner.toString() !== req.currentUser.userId) {
            throw new error_handler_1.NotAuthorizedError('You are not the owner of this store');
        }
        // Check if images have exceeded the max image length
        const totalImages = product.images.length + (images?.uploaded?.length ?? 0) - (images?.deleted?.length ?? 0);
        if (totalImages > product_constants_1.productConstants.MAX_PRODUCT_IMAGES) {
            throw new error_handler_1.BadRequestError('Max number of images is 5');
        }
        const newProductImages = [];
        // Delete all modified images
        if (images?.deleted && images.deleted.length) {
            const deletePromises = images.deleted.map((img_public_id) => (0, cloudinary_upload_1.deleteFile)(img_public_id));
            await Promise.all(deletePromises);
        }
        if (images?.deleted) {
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
        if (images?.uploaded && images.uploaded.length) {
            const imagesToUpload = images.uploaded.map((img) => img.content);
            const imageResponses = (await (0, cloudinary_upload_1.uploadMultiple)(imagesToUpload, 'image', true, true, product_constants_1.productConstants.PRODUCT_IMAGE_FOLDER));
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
        if (videos?.uploaded && videos.uploaded.length) {
            const videosToUpload = videos.uploaded.map((vid) => vid.content);
            const videoResponses = (await (0, cloudinary_upload_1.uploadMultiple)(videosToUpload, 'video', true, true, product_constants_1.productConstants.PRODUCT_VIDEO_FOLDER));
            videoResponses.forEach((vidRes) => {
                if (!vidRes.public_id) {
                    throw new error_handler_1.BadRequestError('An error occurred while uploading video');
                }
                uploadedVideos.push({ url: vidRes.secure_url, public_id: vidRes.public_id });
            });
        }
        const updatedProduct = {
            images: newProductImages,
            videos: videos?.uploaded?.length ? uploadedVideos : product.videos
        };
        product_queue_1.productQueue.addProductJob('updateProductInDB', { key: productId, value: updatedProduct });
        res.status(http_status_codes_1.default.OK).json({ message: 'Product updated successfully', updatedProduct });
    }
    async deleteProduct(req, res) {
        const { productId } = req.params;
        product_queue_1.productQueue.addProductJob('removeProductFromDB', { key: productId, storeId: req.currentUser.storeId });
        res.status(http_status_codes_1.default.OK).json({ message: 'Product deleted successfully', productId });
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
