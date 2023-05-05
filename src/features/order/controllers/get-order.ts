import { IOrderDocument } from '@order/interfaces/order.interface';
import { orderService } from '@service/db/order.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async myOrders(req: Request, res: Response): Promise<void> {
    const orders: IOrderDocument[] = await orderService.getUserOrders(req.currentUser!.userId);
    res.status(HTTP_STATUS.OK).json({ message: 'User orders', orders });
  }

  public async order(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);
    res.status(HTTP_STATUS.OK).json({ message: 'Order details', order });
  }

  public async storeOrders(req: Request, res: Response): Promise<void> {
    const { storeId } = req.params;
    const orders: IOrderDocument[] = await orderService.getOrdersByStoreId(storeId);
    res.status(HTTP_STATUS.OK).json({ message: 'Store orders', orders });
  }
}

export const getOrders: Get = new Get();
