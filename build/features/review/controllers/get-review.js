"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReview = void 0;
const review_service_1 = require("../../../shared/services/db/review.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async reviews(req, res) {
        const { productId } = req.params;
        const reviews = await review_service_1.reviewService.getProductReviews(productId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Product reviews', reviews });
    }
    async storeReviews(req, res) {
        const { storeId } = req.params;
        const reviews = await review_service_1.reviewService.getStoreReviews(storeId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Store reviews', reviews });
    }
}
exports.getReview = new Get();
