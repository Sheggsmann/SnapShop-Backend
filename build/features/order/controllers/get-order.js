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
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const skip = page > 0 ? page * limit : 0;
        const orders = await order_service_1.orderService.getUserOrders(req.currentUser.userId, skip, limit);
        res.status(http_status_codes_1.default.OK).json({ message: 'User orders', orders });
    }
    async order(req, res) {
        const { orderId } = req.params;
        const order = await order_service_1.orderService.getOrderByOrderId(orderId);
        res.status(http_status_codes_1.default.OK).json({ message: 'Order details', order });
    }
    async storeOrders(req, res) {
        const page = req.query.page ? parseInt(req.query.page) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const skip = page > 0 ? page * limit : 0;
        const { storeId } = req.params;
        const orders = await order_service_1.orderService.getOrdersByStoreId(storeId, skip, limit);
        res.status(http_status_codes_1.default.OK).json({ message: 'Store orders', orders });
    }
}
exports.getOrders = new Get();
