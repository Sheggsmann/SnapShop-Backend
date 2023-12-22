"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.balanceWithdrawalRoutes = void 0;
const balance_withdraw_1 = require("../controllers/balance-withdraw");
const auth_middleware_1 = require("../../../shared/globals/middlewares/auth-middleware");
const express_1 = __importDefault(require("express"));
class BalanceWithdrawalRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post('/balance/requests', auth_middleware_1.authMiddleware.restrictTo(['StoreOwner']), balance_withdraw_1.balanceWithdraw.requestWithdrawal);
        // this.router.get("/balance/requests", authMiddleware.restrictTo(["Admin"]))
        return this.router;
    }
}
exports.balanceWithdrawalRoutes = new BalanceWithdrawalRoutes();
