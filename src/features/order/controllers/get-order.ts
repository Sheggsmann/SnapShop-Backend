import { IOrderDocument } from '@order/interfaces/order.interface';
import { orderService } from '@service/db/order.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class Get {
  public async myOrders(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const skip = page > 0 ? page * limit : 0;

    const orders: IOrderDocument[] = await orderService.getUserOrders(req.currentUser!.userId, skip, limit);
    res.status(HTTP_STATUS.OK).json({ message: 'User orders', orders });
  }

  public async order(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);
    res.status(HTTP_STATUS.OK).json({ message: 'Order details', order });
  }

  public async storeOrders(req: Request, res: Response): Promise<void> {
    const page = req.query.page ? parseInt(req.query.page as string) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const skip = page > 0 ? page * limit : 0;
    const { storeId } = req.params;

    const orders: IOrderDocument[] = await orderService.getOrdersByStoreId(storeId, skip, limit);
    res.status(HTTP_STATUS.OK).json({ message: 'Store orders', orders });
  }
}

export const getOrders: Get = new Get();
