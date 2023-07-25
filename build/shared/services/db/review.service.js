"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const review_model_1 = require("../../../features/review/models/review.model");
class ReviewService {
    async addReviewToDB(data) {
        await review_model_1.ReviewModel.create(data);
    }
    async getSingleReview(query) {
        const review = await review_model_1.ReviewModel.findOne(query);
        return review;
    }
    async getProductReviews(productId) {
        return (await review_model_1.ReviewModel.find({ product: productId }).limit(50));
    }
    async getStoreReviews(storeId) {
        return (await review_model_1.ReviewModel.find({ store: storeId }).limit(50));
    }
}
exports.reviewService = new ReviewService();
