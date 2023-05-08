"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const userSchema = joi_1.default.object().keys({
    email: joi_1.default.string().email().required().min(2).max(100).messages({
        'string.base': 'email must be of type string',
        'string.min': 'invalid email',
        'string.max': 'invalid email',
        'string.email': 'invalid email',
        'string.empty': 'email is a required field'
    }),
    image: joi_1.default.string().optional().allow(null, '')
});
exports.userSchema = userSchema;
