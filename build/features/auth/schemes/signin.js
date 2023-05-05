"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const loginSchema = joi_1.default.object().keys({
    mobileNumber: joi_1.default.string().required().length(14).messages({
        'string.base': 'mobile number must be of type string',
        'string.length': 'invalid mobile number',
        'string.empty': 'mobile number is a required field'
    }),
    password: joi_1.default.string().required().min(4).max(20).messages({
        'string.base': 'password must be of type string',
        'string.min': 'invalid password',
        'string.max': 'invalid password',
        'string.empty': 'password is a required field'
    })
});
exports.loginSchema = loginSchema;
