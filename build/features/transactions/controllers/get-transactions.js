"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const transaction_service_1 = require("../../../shared/services/db/transaction.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async userTransactions(req, res) {
        const transactions = await transaction_service_1.transactionService.getUserTransactions(req.params.userId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Transactions fetched successfully', transactions });
    }
    async storeTransactions(req, res) {
        const transactions = await transaction_service_1.transactionService.getUserTransactions(req.params.storeId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Transactions fetched successfully', transactions });
    }
}
exports.getTransactions = new Get();
