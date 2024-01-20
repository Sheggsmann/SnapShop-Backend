"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportOrderSchema = exports.updateOrderSchema = exports.orderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const productSchema = joi_1.default.object({
    _id: joi_1.default.string(),
    product: joi_1.default.object().required(),
    quantity: joi_1.default.number().integer().min(0).max(100).required()
});
const orderSchema = joi_1.default.object().keys({
    products: joi_1.default.array().items(productSchema).required().min(1).max(15).messages({
        'array.base': 'products must be an array',
        'array.min': 'invalid array length',
        'array.max': 'invalid array length',
        'array.empty': 'products is a required field'
    })
});
exports.orderSchema = orderSchema;
const updateOrderSchema = joi_1.default.object().keys({
    deliveryFee: joi_1.default.number().min(1).max(200000).messages({
        'number.base': 'deliveryFee should be a number',
        'number.min': 'deliveryFee should be greater than 1',
        'number.max': 'deliveryFee is too big'
    }),
    products: joi_1.default.array().items(productSchema).min(1).max(50).messages({
        'array.base': 'please select one or more products',
        'array.min': 'no product selected',
        'array.max': 'too many products'
    })
});
exports.updateOrderSchema = updateOrderSchema;
const reportOrderSchema = joi_1.default.object().keys({
    reason: joi_1.default.string().min(1).max(1500).required().messages({
        'string.base': 'reason must be a string',
        'string.empty': 'reason cannot be empty'
    })
});
exports.reportOrderSchema = reportOrderSchema;
