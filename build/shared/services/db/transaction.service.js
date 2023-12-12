"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionService = void 0;
const transaction_model_1 = require("../../../features/transactions/models/transaction.model");
class TransactionService {
    async addTransactionToDB(transaction) {
        await transaction_model_1.TransactionsModel.create(transaction);
    }
}
exports.transactionService = new TransactionService();
