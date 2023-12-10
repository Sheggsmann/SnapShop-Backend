"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderSchema = exports.orderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const orderSchema = joi_1.default.object().keys({
    products: joi_1.default.array().required().min(1).max(15).messages({
        'array.base': 'products must be an array',
        'array.min': 'invalid array length',
        'array.max': 'invalid array length',
        'array.empty': 'products is a required field'
    })
});
exports.orderSchema = orderSchema;
const updateOrderSchema = joi_1.default.object().keys({});
exports.updateOrderSchema = updateOrderSchema;
