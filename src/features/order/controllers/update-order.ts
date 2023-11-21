import { NotAuthorizedError, NotFoundError } from '@global/helpers/error-handler';
import { IOrderDocument } from '@order/interfaces/order.interface';
import { orderService } from '@service/db/order.service';
import { orderQueue } from '@service/queues/order.queue';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class UpdateOrder {
  public async orderPayment(req: Request, res: Response): Promise<void> {
    console.log('\n\n');
    // console.log('[REQUEST HEADERS]:', req.headers);
    console.log('\n[REQUEST BODY]:', req.body);

    const eventData = req.body;
    console.log('\nMETADATA:', eventData.data.metadata);

    res.send(200);
    // res.status(HTTP_STATUS.OK);
  }

  public async order(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { deliveryFee, products } = req.body;

    const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);
    if (!order) throw new NotFoundError('Order not found');

    if (order.store.toString() !== req.currentUser?.storeId) {
      throw new NotAuthorizedError('You are not authorized to make this request');
    }

    order.deliveryFee = deliveryFee;
    order.products = products;
    orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });

    res.status(HTTP_STATUS.OK).json({ message: 'Order updated successfully' });
  }
}

export const updateOrder: UpdateOrder = new UpdateOrder();
