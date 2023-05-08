"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const reviewSchema = joi_1.default.object().keys({
    productId: joi_1.default.string().required().messages({
        'string.base': 'productId must be of type string',
        'string.empty': 'productId is a required field'
    }),
    body: joi_1.default.string().max(1000).messages({
        'string.base': 'body must be of type string',
        'string.max': 'invalid body length'
    }),
    rating: joi_1.default.number().min(1).max(5).required().messages({
        'number.base': 'rating must be of type number',
        'number.empty': 'rating is a required field',
        'number.min': 'invalid rating',
        'number.max': 'invalid rating'
    })
});
exports.reviewSchema = reviewSchema;
