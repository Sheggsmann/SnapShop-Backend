import { IOrderDocument, OrderStatus } from '@order/interfaces/order.interface';
import { OrderModel } from '@order/models/order.model';
import { IProductDocument } from '@product/interfaces/product.interface';
// import { ClientSession } from 'mongoose';

class OrderService {
  public async addOrderToDB(data: IProductDocument): Promise<void> {
    await OrderModel.create(data);
  }

  public async getUserOrders(userId: string): Promise<IOrderDocument[]> {
    const orders: IOrderDocument[] = (await OrderModel.find({ 'user.userId': userId })
      .sort({ createdAt: -1 })
      .populate('store', '_id name description image bgImage owner')
      .populate('products.product', '-quantity -store')) as IOrderDocument[];
    return orders;
  }

  public async getOrderByOrderId(orderId: string): Promise<IOrderDocument | null> {
    return await OrderModel.findOne({ _id: orderId })
      .populate('store', '_id name description image bgImage owner')
      .populate('products.product', '-quantity -store');
  }

  public async getOrdersByStoreId(storeId: string): Promise<IOrderDocument[]> {
    return await OrderModel.find({ store: storeId })
      .populate('store', '_id name description image bgImage owner')
      .populate('products.product', '-quantity -store');
  }

  public async getDeliveredOrders(): Promise<IOrderDocument[]> {
    return await OrderModel.find({ paid: true, status: OrderStatus.DELIVERED });
  }

  public async getOrderByUserId(userId: string): Promise<IOrderDocument | null> {
    return await OrderModel.findOne({ 'user.userId': userId });
  }

  public async getOrderByProductId(productId: string): Promise<IOrderDocument | null> {
    return await OrderModel.findOne({ 'products.product._id': productId });
  }

  public async updateOrder(orderId: string, updatedOrder: IOrderDocument): Promise<void> {
    await OrderModel.updateOne({ _id: orderId }, { $set: updatedOrder });
  }

  public async updateOrderPaymentStatus(
    orderId: string,
    paid: boolean,
    amountPaid: number,
    deliveryCode: string
  ): Promise<void> {
    await OrderModel.updateOne(
      { _id: orderId },
      { $set: { paid, amountPaid, deliveryCode, status: OrderStatus.ACTIVE, paidAt: Date.now() } }
    );
  }
}

export const orderService: OrderService = new OrderService();
