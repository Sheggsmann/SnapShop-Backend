"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versioningSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const versioningSchema = joi_1.default.object().keys({
    version: joi_1.default.string().min(5).max(10).required().messages({
        'string.base': 'version must be of type string',
        'string.min': 'version must be greater than 4 characters long',
        'string.max': 'version must be less than 10 characters long'
    }),
    forceUpdate: joi_1.default.boolean().messages({
        'boolean.base': 'forceUpdate must be of type boolean'
    }),
    update: joi_1.default.boolean().messages({
        'boolean.base': 'update must be of type boolean'
    }),
    app: joi_1.default.string().required().messages({
        'string.base': 'version must be of type string'
    })
});
exports.versioningSchema = versioningSchema;
