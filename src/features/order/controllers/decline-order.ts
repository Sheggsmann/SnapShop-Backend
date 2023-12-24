import { BadRequestError } from '@global/helpers/error-handler';
import { IOrderDocument, OrderStatus } from '@order/interfaces/order.interface';
import { orderService } from '@service/db/order.service';
import { storeService } from '@service/db/store.service';
import { notificationQueue } from '@service/queues/notification.queue';
import { orderQueue } from '@service/queues/order.queue';
import { storeQueue } from '@service/queues/store.queue';
import { transactionQueue } from '@service/queues/transaction.queue';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { ITransactionDocument, TransactionType } from '@transactions/interfaces/transaction.interface';
import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

class DeclineOrder {
  public async byStore(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);
    if (!order) throw new BadRequestError('Order not found');

    if (order.status !== OrderStatus.ACTIVE && order.status !== OrderStatus.PENDING)
      throw new BadRequestError('You cannot decline this order');

    const store: IStoreDocument | null = await storeService.getStoreByStoreId(`${req.currentUser!.storeId}`);
    if (!store) throw new BadRequestError('Store not found');

    // ORDER DECLINED: no need to refund user because payment didn't go through
    if (order.status === OrderStatus.PENDING) {
      order.status = OrderStatus.CANCELLED;
      order.cancelledAt = Date.now();
      order.reason = reason ? reason : '';
      orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });
      notificationQueue.addNotificationJob('sendPushNotificationToUser', {
        key: `${order.user.userId}`,
        value: {
          title: 'Order Declined',
          body: `${store.name} declined your order.`
        }
      });
    }

    // ORDER CANCELLED: need to refund the order
    if (order.status === OrderStatus.ACTIVE) {
      order.status = OrderStatus.CANCELLED;
      order.cancelledAt = Date.now();
      order.reason = reason ? reason : '';
      if (store.escrowBalance >= order.amountPaid) {
        store.escrowBalance -= order.amountPaid;
      }

      orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });
      storeQueue.addStoreJob('updateStoreInDB', { key: `${store._id}`, value: store });

      notificationQueue.addNotificationJob('sendPushNotificationToUser', {
        key: `${order.user.userId}`,
        value: {
          title: `${store.name} declined your order`,
          body: `${reason}`
        }
      });
      transactionQueue.addTransactionJob('addTransactionToDB', {
        store: store._id,
        user: order.user.userId,
        order: orderId,
        amount: Number(order.amountPaid),
        type: TransactionType.REFUND
      } as ITransactionDocument);

      // TODO: Implement logic to refund people
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Order Cancelled', order });
  }
}

export const declineOrder: DeclineOrder = new DeclineOrder();
