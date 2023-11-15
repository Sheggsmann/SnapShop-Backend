"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const order_interface_1 = require("../interfaces/order.interface");
const mongoose_1 = require("mongoose");
const orderSchema = new mongoose_1.Schema({
    store: { type: mongoose_1.Types.ObjectId, ref: 'Store' },
    user: { userId: { type: mongoose_1.Types.ObjectId, ref: 'User' }, name: String, mobileNumber: String },
    products: [{ product: { type: mongoose_1.Types.ObjectId, ref: 'Product', index: true }, quantity: Number }],
    status: {
        type: String,
        default: order_interface_1.OrderStatus.PENDING,
        enum: [order_interface_1.OrderStatus.PENDING, order_interface_1.OrderStatus.ACTIVE, order_interface_1.OrderStatus.DELIVERED, order_interface_1.OrderStatus.CANCELLED]
    },
    paid: { type: Boolean, default: false },
    deliveryFee: Number,
    deliveryCode: Number,
    reason: String,
    deliveryAddress: {
        street: String,
        city: String,
        state: String
    }
}, { timestamps: true });
const OrderModel = (0, mongoose_1.model)('Order', orderSchema, 'Order');
exports.OrderModel = OrderModel;
