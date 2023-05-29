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
exports.createReview = void 0;
const review_queue_1 = require("../../../shared/services/queues/review.queue");
const product_service_1 = require("../../../shared/services/db/product.service");
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const user_service_1 = require("../../../shared/services/db/user.service");
const review_service_1 = require("../../../shared/services/db/review.service");
const joi_validation_decorator_1 = require("../../../shared/globals/helpers/joi-validation-decorator");
const review_scheme_1 = require("../schemes/review.scheme");
const store_service_1 = require("../../../shared/services/db/store.service");
const store_queue_1 = require("../../../shared/services/queues/store.queue");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Create {
    review(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body, rating, productId, storeId, type } = req.body;
            let reviewItem = null;
            if (type === 'product') {
                reviewItem = yield product_service_1.productService.getProductById(productId);
            }
            else if (type == 'store') {
                reviewItem = yield store_service_1.storeService.getStoreByStoreId(storeId);
            }
            if (!reviewItem)
                throw new error_handler_1.NotFoundError('Item to review not found');
            const existingReview = yield review_service_1.reviewService.getSingleReview({
                user: req.currentUser.userId,
                $or: [{ product: reviewItem._id }, { store: reviewItem._id }]
            });
            if (existingReview) {
                throw new error_handler_1.BadRequestError(`You already reviewed this ${type}`);
            }
            const user = yield user_service_1.userService.getUserById(req.currentUser.userId);
            const review = {
                user: user._id,
                userName: `${user.firstname} ${user.lastname}`,
                product: type === 'product' ? reviewItem._id : null,
                productName: type === 'product' ? reviewItem.name : '',
                store: type === 'store' ? reviewItem._id : null,
                storeName: type === 'store' ? reviewItem.name : '',
                body,
                rating
            };
            review_queue_1.reviewQueue.addReviewJob('addReviewToDB', { value: review });
            if (type === 'store') {
                store_queue_1.storeQueue.addStoreJob('updateStoreInDB', {
                    key: `${reviewItem._id}`,
                    value: {
                        ratingsCount: reviewItem.ratingsCount + rating,
                        totalRatings: reviewItem.totalRatings + 1
                    }
                });
            }
            res.status(http_status_codes_1.default.CREATED).json({ message: 'Created successfully', review });
        });
    }
}
__decorate([
    (0, joi_validation_decorator_1.validator)(review_scheme_1.reviewSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], Create.prototype, "review", null);
exports.createReview = new Create();
