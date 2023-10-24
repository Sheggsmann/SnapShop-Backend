"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likedProductSchema = exports.saveStoreSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const userSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().min(2).max(100).optional().allow(null, '').messages({
        'string.base': 'email must be of type string',
        'string.min': 'invalid email',
        'string.max': 'invalid email',
        'string.email': 'invalid email'
    }),
    image: joi_1.default.string().optional().allow(null, '')
});
exports.userSchema = userSchema;
const saveStoreSchema = joi_1.default.object().keys({
    storeId: joi_1.default.string().required().messages({
        'string.base': 'storeId must be a string',
        'string.empty': 'storeId is a required field'
    })
});
exports.saveStoreSchema = saveStoreSchema;
const likedProductSchema = joi_1.default.object().keys({
    productId: joi_1.default.string().required().messages({
        'string.base': 'productId must be a string',
        'string.empty': 'productId is a required field'
    })
});
exports.likedProductSchema = likedProductSchema;
