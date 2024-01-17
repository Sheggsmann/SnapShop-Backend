"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceWithdrawalSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const balanceWithdrawalSchema = joi_1.default.object().keys({
    amount: joi_1.default.number().required().min(1000).max(1000000).messages({
        'number.base': 'amount must be of type number',
        'number.min': 'amount too little to withdraw',
        'number.max': 'amount too large to withdraw'
    }),
    bankName: joi_1.default.string().required().messages({
        'string.base': 'bank name must be of type string',
        'string.empty': 'bank name is a required field'
    }),
    accountName: joi_1.default.string().required().messages({
        'string.base': 'account name must be of type string',
        'string.empty': 'account name is a required field'
    }),
    accountNumber: joi_1.default.string().required().messages({
        'string.base': 'account number should be characters',
        'string.empty': 'account number is a required field'
    })
});
exports.balanceWithdrawalSchema = balanceWithdrawalSchema;
