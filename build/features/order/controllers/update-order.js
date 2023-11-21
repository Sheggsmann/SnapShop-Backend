"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const order_service_1 = require("../../../shared/services/db/order.service");
const order_queue_1 = require("../../../shared/services/queues/order.queue");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class UpdateOrder {
    async orderPayment(req, res) {
        console.log('\n\n');
        // console.log('[REQUEST HEADERS]:', req.headers);
        console.log('\n[REQUEST BODY]:', req.body);
        const eventData = req.body;
        console.log('\nMETADATA:', eventData.data.metadata);
        res.send(200);
        // res.status(HTTP_STATUS.OK);
    }
    async order(req, res) {
        const { orderId } = req.params;
        const { deliveryFee, products } = req.body;
        const order = await order_service_1.orderService.getOrderByOrderId(orderId);
        if (!order)
            throw new error_handler_1.NotFoundError('Order not found');
        if (order.store._id.toString() !== req.currentUser?.storeId?.toString()) {
            throw new error_handler_1.NotAuthorizedError('You are not authorized to make this request');
        }
        order.deliveryFee = deliveryFee;
        order.products = products;
        order_queue_1.orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });
        res.status(http_status_codes_1.default.OK).json({ message: 'Order updated successfully' });
    }
}
exports.updateOrder = new UpdateOrder();
