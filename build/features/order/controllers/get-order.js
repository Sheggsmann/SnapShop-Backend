"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = void 0;
const order_service_1 = require("../../../shared/services/db/order.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class Get {
    async myOrders(req, res) {
        const orders = await order_service_1.orderService.getUserOrders(req.currentUser.userId);
        res.status(http_status_codes_1.default.OK).json({ message: 'User orders', orders });
    }
    async order(req, res) {
        const { orderId } = req.params;
        const order = await order_service_1.orderService.getOrderByOrderId(orderId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Order details', order });
    }
    async storeOrders(req, res) {
        const { storeId } = req.params;
        const orders = await order_service_1.orderService.getOrdersByStoreId(storeId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Store orders', orders });
    }
}
exports.getOrders = new Get();
