"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductCategorySchema = exports.storeSlugSchema = exports.storeLocationUpdateSchema = exports.storeUpdateSchema = exports.storeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const storeSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required().min(2).max(100).messages({
        'string.base': 'name must be of type string',
        'string.min': 'invalid store name',
        'string.max': 'invalid store name',
        'string.empty': 'name is a required field'
    }),
    description: joi_1.default.string().required().min(2).max(1000).messages({
        'string.base': 'description must be of type string',
        'string.min': 'invalid store description',
        'string.max': 'invalid store description',
        'string.empty': 'description is a required field'
    }),
    address: joi_1.default.string().min(1).max(200).messages({
        'string.base': 'address must be of type string',
        'string.min': 'invalid store address',
        'string.max': 'invalid store address',
        'string.empty': 'address is a required field'
    }),
    latlng: joi_1.default.string().required().messages({
        'any.required': 'latlng is a required field',
        'string.empty': 'latlng is not allowed to be empty'
    })
});
exports.storeSchema = storeSchema;
const storeUpdateSchema = joi_1.default.object().keys({
    name: joi_1.default.string().optional().allow(null, '').max(100).messages({
        'string.base': 'name must be of type string',
        'string.min': 'invalid store name',
        'string.max': 'invalid store name',
        'string.empty': 'name is a required field'
    }),
    image: joi_1.default.string().optional().allow(null, ''),
    bgImage: joi_1.default.string().optional().allow(null, ''),
    description: joi_1.default.string().optional().max(1000).messages({
        'string.base': 'description must be of type string',
        'string.min': 'invalid store description',
        'string.max': 'invalid store description',
        'string.empty': 'description is a required field'
    })
});
exports.storeUpdateSchema = storeUpdateSchema;
const storeLocationUpdateSchema = joi_1.default.object().keys({
    latlng: joi_1.default.string().required().messages({
        'any.required': 'latlng is a required field',
        'string.empty': 'latlng is not allowed to be empty'
    }),
    address: joi_1.default.string().required().messages({
        'any.required': 'address is a required field',
        'string.empty': 'address is not allowed to be empty'
    })
});
exports.storeLocationUpdateSchema = storeLocationUpdateSchema;
const storeSlugSchema = joi_1.default.object().keys({
    slug: joi_1.default.string().required().min(5).max(20).messages({
        'any.required': 'slug is a required field',
        'string.empty': 'slug is a required field',
        'string.min': 'slug cannot be less than 5 characters',
        'string.max': 'slug cannot be more than 20 characters'
    })
});
exports.storeSlugSchema = storeSlugSchema;
const updateProductCategorySchema = joi_1.default.object().keys({
    oldCategory: joi_1.default.string().min(1).max(50).required(),
    newCategory: joi_1.default.string().min(1).max(50).required()
});
exports.updateProductCategorySchema = updateProductCategorySchema;
