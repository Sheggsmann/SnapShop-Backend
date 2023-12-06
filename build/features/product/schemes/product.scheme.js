"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductMediaSchema = exports.updateProductSchema = exports.productSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const productSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required().min(2).max(100).messages({
        'string.base': 'name must be of type string',
        'string.min': 'invalid name length',
        'string.max': 'invalid name length',
        'string.empty': 'name is a required field'
    }),
    description: joi_1.default.string().required().min(5).max(1000).messages({
        'string.base': 'description must be of type string',
        'string.min': 'invalid description length',
        'string.max': 'invalid description length',
        'string.empty': 'description is a required field'
    }),
    price: joi_1.default.number().required().min(1).messages({
        'number.base': 'price must be of type number',
        'number.min': 'price should be greater than 1'
    }),
    images: joi_1.default.array().required().min(1).max(5).messages({
        'array.base': 'images must be of type array',
        'array.min': 'invalid array length',
        'array.max': 'invalid array length',
        'array.empty': 'images is a required field'
    }),
    category: joi_1.default.string().required().messages({
        'string.base': 'category must be of type string',
        'string.empty': 'category is a required field'
    }),
    priceDiscount: joi_1.default.number().optional().allow(null, 0),
    quantity: joi_1.default.number().optional().allow(null, 0),
    videos: joi_1.default.array().max(1).optional(),
    tags: joi_1.default.array().max(7).optional().messages({
        'array.base': 'tags must be of type array',
        'array.max': 'too many tags'
    })
});
exports.productSchema = productSchema;
const updateProductSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required().min(2).max(100).messages({
        'string.base': 'name must be of type string',
        'string.min': 'invalid name length',
        'string.max': 'invalid name length',
        'string.empty': 'name is a required field'
    }),
    description: joi_1.default.string().required().min(5).max(1000).messages({
        'string.base': 'description must be of type string',
        'string.min': 'invalid description length',
        'string.max': 'invalid description length',
        'string.empty': 'description is a required field'
    }),
    price: joi_1.default.number().required().min(1).messages({
        'number.base': 'price must be of type number',
        'number.min': 'price should be greater than 1'
    }),
    images: joi_1.default.array().required().min(1).max(5).messages({
        'array.base': 'images must be of type array',
        'array.min': 'invalid array length',
        'array.max': 'invalid array length',
        'array.empty': 'images is a required field'
    }),
    category: joi_1.default.string().required().messages({
        'string.base': 'category must be of type string',
        'string.empty': 'category is a required field'
    }),
    priceDiscount: joi_1.default.number().optional().allow(null, 0),
    quantity: joi_1.default.number().optional().allow(null, 0),
    videos: joi_1.default.array().max(1).optional(),
    tags: joi_1.default.array().max(7).optional().messages({
        'array.base': 'tags must be of type array',
        'array.max': 'too many tags'
    })
});
exports.updateProductSchema = updateProductSchema;
const updateProductMediaSchema = joi_1.default.object().keys({
    images: joi_1.default.object({
        uploaded: joi_1.default.array().max(5).optional().allow(null).messages({
            'array.base': 'uploaded must be an array'
        }),
        deleted: joi_1.default.array().max(5).optional().allow(null).messages({
            'array.base': 'deleted must be an array'
        })
    }),
    videos: joi_1.default.object({
        uploaded: joi_1.default.array().max(5).optional().allow(null).messages({
            'array.base': 'uploaded must be an array'
        }),
        deleted: joi_1.default.array().max(5).optional().allow(null).messages({
            'array.base': 'deleted must be an array'
        })
    })
});
exports.updateProductMediaSchema = updateProductMediaSchema;
