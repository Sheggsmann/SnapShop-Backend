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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const review_model_1 = require("../../../features/review/models/review.model");
class ReviewService {
    addReviewToDB(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield review_model_1.ReviewModel.create(data);
        });
    }
    getSingleReview(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = yield review_model_1.ReviewModel.findOne(query);
            return review;
        });
    }
    getProductReviews(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield review_model_1.ReviewModel.find({ product: productId }).limit(50));
        });
    }
}
exports.reviewService = new ReviewService();
