"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = void 0;
const transaction_model_1 = require("../../../features/transactions/models/transaction.model");
class TransactionService {
    async addTransactionToDB(transaction) {
        await transaction_model_1.TransactionsModel.create(transaction);
    }
    async getUserTransactions(userId) {
        return await transaction_model_1.TransactionsModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('store', '_id name image mobileNumber');
    }
    async getStoreTransactions(storeId) {
        return await transaction_model_1.TransactionsModel.find({ store: storeId })
            .sort({ createdAt: -1 })
            .populate('user', '_id name profilePicture mobileNumber')
            .populate('order', 'products status paid serviceFee');
    }
}
exports.transactionService = new TransactionService();
