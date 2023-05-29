"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModel = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    product: mongoose_1.Types.ObjectId,
    store: mongoose_1.Types.ObjectId,
    user: mongoose_1.Types.ObjectId,
    productName: String,
    storeName: String,
    userName: String,
    body: String,
    rating: Number,
    type: { type: String, enum: ['product', 'store'] },
    images: []
});
const ReviewModel = (0, mongoose_1.model)('Review', reviewSchema, 'Review');
exports.ReviewModel = ReviewModel;
