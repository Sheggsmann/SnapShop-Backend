"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrder = void 0;
const error_handler_1 = require("../../../shared/globals/helpers/error-handler");
const order_interface_1 = require("../interfaces/order.interface");
const order_service_1 = require("../../../shared/services/db/order.service");
const order_queue_1 = require("../../../shared/services/queues/order.queue");
const config_1 = require("../../../config");
const helpers_1 = require("../../../shared/globals/helpers/helpers");
const store_service_1 = require("../../../shared/services/db/store.service");
const chat_1 = require("../../../shared/sockets/chat");
const notification_queue_1 = require("../../../shared/services/queues/notification.queue");
const transaction_queue_1 = require("../../../shared/services/queues/transaction.queue");
const transaction_interface_1 = require("../../transactions/interfaces/transaction.interface");
const crypto_1 = __importDefault(require("crypto"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
// import mongoose from 'mongoose';
const KOBO_IN_NAIRA = 100;
class UpdateOrder {
    async orderPayment(req, res) {
        // OUS => Order Id, User Id, Store Id
        const hash = crypto_1.default
            .createHmac('sha512', config_1.config.PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');
        if (hash === req.headers['x-paystack-signature']) {
            // console.log('[REQUEST HEADERS]:', req.headers);
            console.log('\n[REQUEST BODY]:', req.body);
            const eventData = req.body;
            if (eventData.event === 'charge.success') {
                const [orderId, userId, storeId] = eventData.data.reference.split('-');
                // Amount in Kobo, change to naira
                const amountPaid = eventData.data.amount / KOBO_IN_NAIRA;
                transaction_queue_1.transactionQueue.addTransactionJob('addTransactionToDB', {
                    store: storeId,
                    order: orderId,
                    user: userId,
                    amount: amountPaid,
                    type: transaction_interface_1.TransactionType.ORDER_PAYMENT
                });
                // TODO: Check if the amount paid is the same as the total of all the products
                const order = await order_service_1.orderService.getOrderByOrderId(orderId);
                if (order) {
                    // sum the price of all the products and their quantities and check if the amount paid is equal
                    let total = order.products.reduce((acc, item) => (acc += item.product.price * item.quantity), 0);
                    total += helpers_1.Helpers.calculateServiceFee(total);
                    total += order?.deliveryFee || 0;
                    console.log('ORDER TOTAL:', total);
                    console.log('AMOUNT PAID:', amountPaid);
                    if (total === amountPaid) {
                        const deliveryCode = helpers_1.Helpers.generateOtp(4);
                        await order_service_1.orderService.updateOrderPaymentStatus(orderId, true, amountPaid, deliveryCode);
                        await store_service_1.storeService.updateStoreEscrowBalance(storeId, amountPaid);
                        // TODO: emit event using socket.io
                        chat_1.socketIOChatObject.to(userId).to(storeId).emit('order:update', { order });
                        // TODO: send push notification to the user and the store
                        notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToStore', {
                            key: storeId,
                            value: {
                                title: `Order Payment 🥳`,
                                body: `${order.user.name} just paid ₦${amountPaid} for order #${order._id
                                    .toString()
                                    .substring(0, 8)}.\nOrder delivery code is: ${deliveryCode}`
                            }
                        });
                        notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToUser', {
                            key: userId,
                            value: {
                                title: `Payment Completed 🥳`,
                                body: 'Enter the 4 digit code from the merchant to validate the order on delivery.'
                            }
                        });
                    }
                }
            }
        }
        else {
            console.error('\n\n COULD NOT VALIDATE PAYSTACK WEBHOOK');
        }
        res.sendStatus(200);
    }
    async devOrderPayment(req, res) {
        const { amountPaid, orderId, storeId } = req.body;
        const order = await order_service_1.orderService.getOrderByOrderId(orderId);
        if (order) {
            const total = order.products.reduce((acc, item) => (acc += item.product.price * item.quantity), 0);
            if (total !== amountPaid)
                throw new error_handler_1.BadRequestError('Incorrect amount');
            const deliveryCode = helpers_1.Helpers.generateOtp(4);
            await order_service_1.orderService.updateOrderPaymentStatus(orderId, true, amountPaid, deliveryCode);
            await store_service_1.storeService.updateStoreEscrowBalance(storeId, amountPaid);
            transaction_queue_1.transactionQueue.addTransactionJob('addTransactionToDB', {
                store: storeId,
                order: orderId,
                user: req.currentUser.userId,
                amount: Number(amountPaid),
                type: transaction_interface_1.TransactionType.ORDER_PAYMENT
            });
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'Payment Success' });
    }
    // TODO: add validator for update order
    async order(req, res) {
        const { orderId } = req.params;
        const { deliveryFee, products } = req.body;
        const order = await order_service_1.orderService.getOrderByOrderId(orderId);
        if (!order)
            throw new error_handler_1.NotFoundError('Order not found');
        const isOrderStore = order.store._id.toString() === req.currentUser.storeId?.toString();
        const isOrderUser = order.user.userId.toString() === req.currentUser.userId.toString();
        if (!isOrderStore && !isOrderUser) {
            throw new error_handler_1.NotAuthorizedError('You are not authorized to make this request');
        }
        order.deliveryFee = deliveryFee;
        order.products = products;
        order_queue_1.orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });
        chat_1.socketIOChatObject
            .to(order.store._id.toString())
            .to(order.user.userId.toString())
            .emit('order:update', { order });
        // TODO: if update is from user, send notification to store
        if (isOrderUser) {
            notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToStore', {
                key: order.store._id,
                value: {
                    title: `Order Updated`,
                    body: `${order.user.name} just updated the product quantity for order #${order._id
                        .toString()
                        .substring(0, 8)}`
                }
            });
        }
        // if update is from store, send update to user
        if (isOrderStore) {
            notification_queue_1.notificationQueue.addNotificationJob('sendPushNotificationToUser', {
                key: order.user.userId,
                value: {
                    title: 'Order Updated',
                    body: `${order.store.name} added a delivery fee for order #${order._id
                        .toString()
                        .substring(0, 8)}`
                }
            });
        }
        res.status(http_status_codes_1.default.OK).json({ message: 'Order updated successfully', order });
    }
    async completeOrder(req, res) {
        const { orderId } = req.params;
        const order = await order_service_1.orderService.getOrderByOrderId(orderId);
        if (!order)
            throw new error_handler_1.NotFoundError('Order not found');
        if (order.deliveryCode !== req.body.deliveryCode) {
            throw new error_handler_1.BadRequestError('Invalid delivery code');
        }
        order.status = order_interface_1.OrderStatus.DELIVERED;
        order_queue_1.orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });
        chat_1.socketIOChatObject
            .to(order.user.userId.toString())
            .to(order.store._id.toString())
            .emit('order:update', { order });
        res.status(http_status_codes_1.default.OK).json({ message: 'Order completed' });
    }
}
exports.updateOrder = new UpdateOrder();
