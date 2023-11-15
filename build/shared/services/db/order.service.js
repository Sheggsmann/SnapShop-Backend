"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const order_model_1 = require("../../../features/order/models/order.model");
class OrderService {
    async addOrderToDB(data) {
        await order_model_1.OrderModel.create(data);
    }
    async getUserOrders(userId) {
        const orders = (await order_model_1.OrderModel.find({ 'user.userId': userId })
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
            .populate('store', '_id name description image bgImage owner')
            .populate('products.product', '-quantity -store');
    }
    async updateOrder(orderId, updatedOrder) {
        await order_model_1.OrderModel.updateOne({ _id: orderId }, { $set: updatedOrder });
    }
}
exports.orderService = new OrderService();
