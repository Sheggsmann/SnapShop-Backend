"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true, index: true },
    store: { type: mongoose_1.Types.ObjectId, ref: 'Store', required: true, index: true },
    price: { type: Number, min: 0, default: 0, required: true },
    description: String,
    category: String,
    images: [{ url: String, public_id: String }],
    videos: [{ url: String, public_id: String }],
    priceDiscount: Number,
    quantity: Number
}, { timestamps: true });
const ProductModel = (0, mongoose_1.model)('Product', productSchema, 'Product');
exports.ProductModel = ProductModel;
