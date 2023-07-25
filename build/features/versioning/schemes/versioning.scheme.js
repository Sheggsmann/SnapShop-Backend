"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.versioningSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const versioningSchema = joi_1.default.object().keys({
    version: joi_1.default.string().length(5).required().messages({
        'string.base': 'version must be of type string',
        'string.length': 'version must be exactly 5 characters long'
    }),
    forceUpdate: joi_1.default.boolean().messages({
        'boolean.base': 'forceUpdate must be of type boolean'
    })
});
exports.versioningSchema = versioningSchema;
