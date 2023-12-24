"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.declineOrder = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const order_interface_1 = require("../interfaces/order.interface");
const order_service_1 = require("../../../shared/services/db/order.service");
const store_service_1 = require("../../../shared/services/db/store.service");
const notification_queue_1 = require("../../../shared/services/queues/notification.queue");
const order_queue_1 = require("../../../shared/services/queues/order.queue");
const store_queue_1 = require("../../../shared/services/queues/store.queue");
const transaction_queue_1 = require("../../../shared/services/queues/transaction.queue");
const transaction_interface_1 = require("../../transactions/interfaces/transaction.interface");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class DeclineOrder {
    async byStore(req, res) {
        const { orderId } = req.params;
        const { reason } = req.body;
        const order = await order_service_1.orderService.getOrderByOrderId(orderId);
        if (!order)
            throw new error_handler_1.BadRequestError('Order not found');
        if (order.status !== order_interface_1.OrderStatus.ACTIVE && order.status !== order_interface_1.OrderStatus.PENDING)
            throw new error_handler_1.BadRequestError('You cannot decline this order');
        const store = await store_service_1.storeService.getStoreByStoreId(`${req.currentUser.storeId}`);
        if (!store)
            throw new error_handler_1.BadRequestError('Store not found');
        // ORDER DECLINED: no need to refund user because payment didn't go through
        if (order.status === order_interface_1.OrderStatus.PENDING) {
            order.status = order_interface_1.OrderStatus.CANCELLED;
            order.cancelledAt = Date.now();
            order.reason = reason ? reason : '';
            order_queue_1.orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });
            notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToUser', {
                key: `${order.user.userId}`,
                value: {
                    title: 'Order Declined',
                    body: `${store.name} declined your order.`
                }
            });
        }
        // ORDER CANCELLED: need to refund the order
        if (order.status === order_interface_1.OrderStatus.ACTIVE) {
            order.status = order_interface_1.OrderStatus.CANCELLED;
            order.cancelledAt = Date.now();
            order.reason = reason ? reason : '';
            if (store.escrowBalance >= order.amountPaid) {
                store.escrowBalance -= order.amountPaid;
            }
            order_queue_1.orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });
            store_queue_1.storeQueue.addStoreJob('updateStoreInDB', { key: `${store._id}`, value: store });
            notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToUser', {
                key: `${order.user.userId}`,
                value: {
                    title: `${store.name} declined your order`,
                    body: `${reason}`
                }
            });
            transaction_queue_1.transactionQueue.addTransactionJob('addTransactionToDB', {
                store: store._id,
                user: order.user.userId,
                order: orderId,
                amount: Number(order.amountPaid),
                type: transaction_interface_1.TransactionType.REFUND
            });
            // TODO: Implement logic to refund people
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'Order Cancelled', order });
    }
}
exports.declineOrder = new DeclineOrder();
