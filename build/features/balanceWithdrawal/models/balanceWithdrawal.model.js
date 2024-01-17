"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceWithdrawalModel = void 0;
const balanceWithdrawal_interface_1 = require("../interfaces/balanceWithdrawal.interface");
const mongoose_1 = require("mongoose");
const balanceWithdrawalSchema = new mongoose_1.Schema({
    amount: { type: Number, min: 0, max: 1000000 },
    store: { type: mongoose_1.Types.ObjectId, ref: 'Store', index: true },
    bankName: { type: String },
    accountName: { type: String },
    accountNumber: { type: String },
    status: {
        type: String,
        enum: [
            balanceWithdrawal_interface_1.balanceWithdrawalStatus.PENDING,
            balanceWithdrawal_interface_1.balanceWithdrawalStatus.COMPLETED,
            balanceWithdrawal_interface_1.balanceWithdrawalStatus.DECLINED
        ],
        default: balanceWithdrawal_interface_1.balanceWithdrawalStatus.PENDING
    }
}, { timestamps: true });
const BalanceWithdrawalModel = (0, mongoose_1.model)('BalanceWithdrawal', balanceWithdrawalSchema, 'BalanceWithdrawal');
exports.BalanceWithdrawalModel = BalanceWithdrawalModel;
