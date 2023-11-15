"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const create_review_1 = require("../controllers/create-review");
const get_review_1 = require("../controllers/get-review");
class ReviewRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/product/reviews/:productId', auth_middleware_1.authMiddleware.checkAuth, get_review_1.getReview.reviews);
        this.router.get('/store/reviews/:storeId', auth_middleware_1.authMiddleware.checkAuth, get_review_1.getReview.storeReviews);
        this.router.post('/reviews', auth_middleware_1.authMiddleware.checkAuth, create_review_1.createReview.review);
        return this.router;
    }
}
exports.reviewRoutes = new ReviewRoutes();
