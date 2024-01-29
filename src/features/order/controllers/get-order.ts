import { IOrderDocument } from '@order/interfaces/order.interface';
import { orderService } from '@service/db/order.service';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

const PAGE_SIZE = 50;

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

  public async all(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip = (parseInt(page) - 1) * PAGE_SIZE;
    const limit = parseInt(page) * PAGE_SIZE;
    const orders: IOrderDocument[] = await orderService.getOrders(skip, limit);
    const ordersCount = await orderService.getOrdersCount();

    res.status(HTTP_STATUS.OK).json({ message: 'Orders', orders, ordersCount });
  }
}

export const getOrders: Get = new Get();
