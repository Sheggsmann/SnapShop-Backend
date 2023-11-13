"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const update_order_1 = require("../../order/controllers/update-order");
const express_1 = __importDefault(require("express"));
class PaymentRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        // Add IP address whitelist
        this.router.post('/payment/order/verify', update_order_1.updateOrder.orderPayment);
        return this.router;
    }
}
exports.paymentRoutes = new PaymentRoutes();
