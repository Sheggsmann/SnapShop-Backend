"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileNumberSchema = exports.passwordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const mobileNumberSchema = joi_1.default.object().keys({
    mobileNumber: joi_1.default.string().required().length(14).messages({
        'string.base': 'mobile number must be of type string',
        'string.min': 'invalid number',
        'string.max': 'invalid number',
        'string.empty': 'mobile number is required'
    }),
    otpProvider: joi_1.default.string().required().messages({
        'string.base': 'otp provider must be of type string',
        'string.empty': 'otp provider is required'
    }),
    app: joi_1.default.string()
});
exports.mobileNumberSchema = mobileNumberSchema;
const passwordSchema = joi_1.default.object().keys({
    mobileNumber: joi_1.default.string().required().length(14).messages({
        'string.base': 'mobile number must be of type string',
        'string.min': 'invalid number',
        'string.max': 'invalid number',
        'string.empty': 'mobile number is required'
    }),
    password: joi_1.default.string().min(4).max(20).messages({
        'string.base': 'password must be of type string',
        'string.min': 'invalid password',
        'string.max': 'invalid password',
        'string.empty': 'password is required'
    }),
    otp: joi_1.default.string().length(4).required().messages({
        'string.base': 'otp must be of type string',
        'string.empty': 'otp is a required field'
    }),
    confirmPassword: joi_1.default.string().required().valid(joi_1.default.ref('password')).messages({
        'any.only': 'passwords should match',
        'any.required': 'confirm password is a required field'
    })
});
exports.passwordSchema = passwordSchema;
