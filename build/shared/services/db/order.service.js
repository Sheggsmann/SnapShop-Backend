"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const order_model_1 = require("../../../features/order/models/order.model");
class OrderService {
    addOrderToDB(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield order_model_1.OrderModel.create(data);
        });
    }
    getUserOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = (yield order_model_1.OrderModel.find({ 'user.userId': userId })
                .populate('store', '_id name description image bgImage owner')
                .populate('products.product', '-quantity -store'));
            return orders;
        });
    }
    getOrderByOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_model_1.OrderModel.findOne({ _id: orderId })
                .populate('store', '_id name description image bgImage owner')
                .populate('products.product', '-quantity -store');
        });
    }
    getOrdersByStoreId(storeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_model_1.OrderModel.find({ store: storeId })
                .populate('store', '_id name description image bgImage owner')
                .populate('products.product', '-quantity -store');
        });
    }
}
exports.orderService = new OrderService();
