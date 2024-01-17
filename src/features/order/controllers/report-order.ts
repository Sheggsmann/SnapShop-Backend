import { Response, Request } from 'express';
import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handler';
import { IOrderDocument, OrderStatus } from '@order/interfaces/order.interface';
import { orderService } from '@service/db/order.service';
import { orderQueue } from '@service/queues/order.queue';
import { validator } from '@global/helpers/joi-validation-decorator';
import { reportOrderSchema } from '@order/schemes/order.scheme';
import { notificationQueue } from '@service/queues/notification.queue';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { socketIOChatObject } from '@socket/chat';
import HTTP_STATUS from 'http-status-codes';

class ReportOrder {
  @validator(reportOrderSchema)
  public async report(req: Request, res: Response): Promise<void> {
    // Get the order Id and reason(body)
    const { orderId } = req.params;
    const { reason } = req.body;

    const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);
    if (!order) throw new NotFoundError('Order not found');

    // return bad request error if user did not place the order.
    if (order.user.userId.toString() !== req.currentUser!.userId.toString())
      throw new NotAuthorizedError('You cannot raise a dispute for this order');

    // ensure the order is delivered, completed orders or declined orders can't be reported
    if (order.status !== OrderStatus.DELIVERED) throw new BadRequestError('Order must be delivered');

    /* 
    if checks pass: flag the order as dispute(money cannot be moved)
    store the reason to db
    */
    order.status = OrderStatus.DISPUTE;
    order.reason = reason;

    orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });

    socketIOChatObject
      .to((order.store as IStoreDocument)._id.toString())
      .to(order.user.userId.toString())
      .emit('order:update', { order });

    notificationQueue.addNotificationJob('sendPushNotificationToStore', {
      key: `${(order.store as IStoreDocument)._id}`,
      value: {
        title: `${order.user.name} reported an issue with their order 😞`,
        body: `${reason}`
      }
    });

    res.status(HTTP_STATUS.OK).json({ message: 'Order report success', order });
  }
}

export const reportOrder: ReportOrder = new ReportOrder();
