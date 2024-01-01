"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const get_transactions_1 = require("../controllers/get-transactions");
class TransactionRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get('/transactions/user/:userId', auth_middleware_1.authMiddleware.checkAuth, get_transactions_1.getTransactions.userTransactions);
        this.router.get('/transactions/store/:storeId', auth_middleware_1.authMiddleware.checkAuth, get_transactions_1.getTransactions.storeTransactions);
        return this.router;
    }
}
exports.transactionRoutes = new TransactionRoutes();
