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

  public async getOrderByUserId(userId: string): Promise<IOrderDocument | null> {
    return await OrderModel.findOne({ 'user.userId': userId });
  }

  public async getOrderByProductId(productId: string): Promise<IOrderDocument | null> {
    return await OrderModel.findOne({ 'products.product._id': productId });
  }

  public async updateOrder(orderId: string, updatedOrder: IOrderDocument): Promise<void> {
    await OrderModel.updateOne({ _id: orderId }, { $set: updatedOrder });
  }

  public async updateOrderPaymentStatus(orderId: string, paid: boolean, deliveryCode: string): Promise<void> {
    await OrderModel.updateOne(
      { _id: orderId },
      { $set: { paid, deliveryCode, status: OrderStatus.ACTIVE } }
    );
  }
}

export const orderService: OrderService = new OrderService();
