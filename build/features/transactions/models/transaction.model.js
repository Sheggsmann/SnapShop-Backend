"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsModel = void 0;
const mongoose_1 = require("mongoose");
const transaction_interface_1 = require("../interfaces/transaction.interface");
const transactionsSchema = new mongoose_1.Schema({
    store: { type: mongoose_1.Types.ObjectId, ref: 'Store' },
    user: { type: mongoose_1.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    type: {
        type: String,
        enum: [
            transaction_interface_1.TransactionType.ORDER_PAYMENT,
            transaction_interface_1.TransactionType.WITHDRAWAL,
            transaction_interface_1.TransactionType.DEPOSIT,
            transaction_interface_1.TransactionType.REFUND
        ],
        required: true
    },
    order: { type: mongoose_1.Types.ObjectId, ref: 'Order' }
}, { timestamps: true });
const TransactionsModel = (0, mongoose_1.model)('Transactions', transactionsSchema, 'Transactions');
exports.TransactionsModel = TransactionsModel;
