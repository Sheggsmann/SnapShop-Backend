import { IOrderDocument, OrderStatus } from '@order/interfaces/order.interface';
import { Model, Schema, Types, model } from 'mongoose';

const orderSchema: Schema = new Schema(
  {
    store: { type: Types.ObjectId, ref: 'Store' },
    user: { userId: { type: Types.ObjectId, ref: 'User' }, name: String, mobileNumber: String },
    products: [{ product: { type: Types.ObjectId, ref: 'Product' }, quantity: Number }],
    status: {
      type: String,
      default: OrderStatus.PENDING,
      enum: [OrderStatus.PENDING, OrderStatus.ACTIVE, OrderStatus.DELIVERED, OrderStatus.CANCELLED]
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
  },
  { timestamps: true }
);

const OrderModel: Model<IOrderDocument> = model<IOrderDocument>('Order', orderSchema, 'Order');
export { OrderModel };
