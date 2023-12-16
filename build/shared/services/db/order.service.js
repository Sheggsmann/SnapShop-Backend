"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const order_interface_1 = require("../../../features/order/interfaces/order.interface");
const order_model_1 = require("../../../features/order/models/order.model");
// import { ClientSession } from 'mongoose';
class OrderService {
    async addOrderToDB(data) {
        await order_model_1.OrderModel.create(data);
    }
    async getUserOrders(userId) {
        const orders = (await order_model_1.OrderModel.find({ 'user.userId': userId })
            .sort({ createdAt: -1 })
            .populate('store', '_id name description image bgImage owner')
            .populate('products.product', '-quantity -store'));
        return orders;
    }
    async getOrderByOrderId(orderId) {
        return await order_model_1.OrderModel.findOne({ _id: orderId })
            .populate('store', '_id name description image bgImage owner')
            .populate('products.product', '-quantity -store');
    }
    async getOrdersByStoreId(storeId) {
        return await order_model_1.OrderModel.find({ store: storeId })
            .sort({ createdAt: -1 })
            .populate('store', '_id name description image bgImage owner')
            .populate('user.userId', '_id firstname lastname mobileNumber profilePicture')
            .populate('products.product', '-quantity -store');
    }
    async getDeliveredOrders() {
        return await order_model_1.OrderModel.find({ paid: true, status: order_interface_1.OrderStatus.DELIVERED });
    }
    async getOrderByUserId(userId) {
        return await order_model_1.OrderModel.findOne({ 'user.userId': userId });
    }
    async getOrderByProductId(productId) {
        return await order_model_1.OrderModel.findOne({ 'products.product._id': productId });
    }
    async updateOrder(orderId, updatedOrder) {
        await order_model_1.OrderModel.updateOne({ _id: orderId }, { $set: updatedOrder });
    }
    async updateOrderStatus(orderId, status) {
        await order_model_1.OrderModel.updateOne({ _id: orderId }, { $set: { status } });
    }
    async updateOrderPaymentStatus(orderId, paid, amountPaid, deliveryCode) {
        await order_model_1.OrderModel.updateOne({ _id: orderId }, { $set: { paid, amountPaid, deliveryCode, status: order_interface_1.OrderStatus.ACTIVE, paidAt: Date.now() } });
    }
}
exports.orderService = new OrderService();
