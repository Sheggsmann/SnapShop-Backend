"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccountSchema = exports.resendOtpSchema = exports.signupSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const signupSchema = joi_1.default.object().keys({
    mobileNumber: joi_1.default.string().required().length(14).messages({
        'string.base': 'mobile number must be of type string',
        'string.length': 'invalid number',
        'string.empty': 'mobile number is required'
    }),
    password: joi_1.default.string().min(4).max(10).messages({
        'string.base': 'password must be of type string',
        'string.min': 'invalid password',
        'string.max': 'invalid password',
        'string.empty': 'password is required'
    }),
    firstname: joi_1.default.string().required().messages({
        'string.base': 'Firstname must be of type string',
        'string.empty': 'first name is required'
    }),
    lastname: joi_1.default.string().required().messages({
        'string.base': 'Lastname must be of type string',
        'string.empty': 'last name is required'
    }),
    otpProvider: joi_1.default.string().required().messages({
        'string.base': 'otp provider must be of type string',
        'string.empty': 'otp provider is required'
    }),
    app: joi_1.default.string().optional().valid('merchant').messages({
        'string.base': 'app must be of type string'
    })
});
exports.signupSchema = signupSchema;
const verifyAccountSchema = joi_1.default.object().keys({
    mobileNumber: joi_1.default.string().required().length(14).messages({
        'string.base': 'mobile number must be of type string',
        'string.length': 'invalid mobile number',
        'string.empty': 'mobile number is required'
    }),
    otp: joi_1.default.string().required().length(4).messages({
        'string.base': 'otp must be of type string',
        'string.empty': 'otp is required'
    })
});
exports.verifyAccountSchema = verifyAccountSchema;
const resendOtpSchema = joi_1.default.object().keys({
    mobileNumber: joi_1.default.string().required().length(14).messages({
        'string.base': 'mobile number must be of type string',
        'string.length': 'invalid mobile number',
        'string.empty': 'mobile number is required'
    }),
    otpProvider: joi_1.default.string().required().messages({
        'string.base': 'otp provider must be of type string',
        'string.empty': 'otp provider is required'
    })
});
exports.resendOtpSchema = resendOtpSchema;
