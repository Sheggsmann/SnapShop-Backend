"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeUpdateSchema = exports.storeSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const storeSchema = joi_1.default.object().keys({
    name: joi_1.default.string().required().min(2).max(100).messages({
        'string.base': 'name must be of type string',
        'string.min': 'invalid store name',
        'string.max': 'invalid store name',
        'string.empty': 'name is a required field'
    }),
    image: joi_1.default.string().required().messages({
        'any.required': 'image is a required field',
        'string.empty': 'image is not allowed to be empty'
    }),
    bgImage: joi_1.default.string().optional().allow(null, ''),
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
    name: joi_1.default.string().required().min(2).max(100).messages({
        'string.base': 'name must be of type string',
        'string.min': 'invalid store name',
        'string.max': 'invalid store name',
        'string.empty': 'name is a required field'
    }),
    image: joi_1.default.string().optional().allow(null, ''),
    bgImage: joi_1.default.string().optional().allow(null, ''),
    description: joi_1.default.string().required().min(2).max(1000).messages({
        'string.base': 'description must be of type string',
        'string.min': 'invalid store description',
        'string.max': 'invalid store description',
        'string.empty': 'description is a required field'
    })
});
exports.storeUpdateSchema = storeUpdateSchema;
