import { BadRequestError, NotAuthorizedError, NotFoundError } from '@global/helpers/error-handler';
import { IOrderDocument, OrderStatus } from '@order/interfaces/order.interface';
import { orderService } from '@service/db/order.service';
import { orderQueue } from '@service/queues/order.queue';
import { IStoreDocument } from '@store/interfaces/store.interface';
import { IProductDocument } from '@product/interfaces/product.interface';
import { Request, Response } from 'express';
import { config } from '@root/config';
import { Helpers } from '@global/helpers/helpers';
import { storeService } from '@service/db/store.service';
import { socketIOChatObject } from '@socket/chat';
import { notificationQueue } from '@service/queues/notification.queue';
import crypto from 'crypto';
// import mongoose from 'mongoose';
import HTTP_STATUS from 'http-status-codes';

const KOBO_IN_NAIRA = 100;

class UpdateOrder {
  public async orderPayment(req: Request, res: Response): Promise<void> {
    // OUS => Order Id, User Id, Store Id

    const hash = crypto
      .createHmac('sha512', config.PAYSTACK_SECRET_KEY!)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash === req.headers['x-paystack-signature']) {
      // console.log('[REQUEST HEADERS]:', req.headers);
      console.log('\n[REQUEST BODY]:', req.body);

      const eventData = req.body;

      if (eventData.event === 'charge.success') {
        const [orderId, userId, storeId] = eventData.data.reference.split('-');

        // Amount in Kobo, change to naira
        const amountPaid: number = eventData.data.amount / KOBO_IN_NAIRA;

        // TODO: Check if the amount paid is the same as the total of all the products
        const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);

        if (order) {
          // sum the price of all the products and their quantities and check if the amount paid is equal
          let total: number = order.products.reduce(
            (acc, item) => (acc += (item.product as IProductDocument).price * item.quantity),
            0
          );

          total += Helpers.calculateServiceFee(total);
          total += order?.deliveryFee || 0;

          console.log('ORDER TOTAL:', total);
          console.log('AMOUNT PAID:', amountPaid);

          if (total === amountPaid) {
            const deliveryCode = Helpers.generateOtp(4);
            await orderService.updateOrderPaymentStatus(orderId, true, deliveryCode);
            await storeService.updateStoreEscrowBalance(storeId, amountPaid);

            // TODO: emit event using socket.io
            socketIOChatObject.to(userId).to(storeId).emit('order:update', { order });

            // TODO: send push notification to the user and the store
            notificationQueue.addNotificationJob('sendPushNotificationToStore', {
              key: storeId,
              value: {
                title: `Order Payment 🥳`,
                body: `${order.user.name} just paid ₦${amountPaid} for order #${order._id
                  .toString()
                  .substring(0, 8)}`
              }
            });
          }
        }
      }
    } else {
      console.error('\n\n COULD NOT VALIDATE PAYSTACK WEBHOOK');
    }

    res.sendStatus(200);
  }

  public async order(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;
    const { deliveryFee, products } = req.body;

    const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);
    if (!order) throw new NotFoundError('Order not found');

    const isOrderStore =
      (order.store as IStoreDocument)._id.toString() === req.currentUser!.storeId?.toString();

    const isOrderUser = order.user.userId.toString() === req.currentUser!.userId.toString();

    if (!isOrderStore && !isOrderUser) {
      throw new NotAuthorizedError('You are not authorized to make this request');
    }

    order.deliveryFee = deliveryFee;
    order.products = products;
    orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });

    socketIOChatObject
      .to(`${req.currentUser!.storeId}`)
      .to(order.user.userId as string)
      .emit('order:update', { order });

    // TODO: if update is from user, send notification to store
    if (isOrderUser) {
      notificationQueue.addNotificationJob('sendPushNotificationToStore', {
        key: (order.store as IStoreDocument)._id as string,
        value: {
          title: `Order Updated`,
          body: `${order.user.name} just updated the product quantity for order #${order._id
            .toString()
            .substring(0, 8)}`
        }
      });
    }

    // if update is from store, send update to user
    if (isOrderStore) {
      notificationQueue.addNotificationJob('sendPushNotificationToUser', {
        key: order.user.userId as string,
        value: {
          title: 'Order Updated',
          body: `${(order.store as IStoreDocument).name} added a delivery fee for order #${order._id
            .toString()
            .substring(0, 8)}`
        }
      });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Order updated successfully', order });
  }

  public async completeOrder(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params;

    const order: IOrderDocument | null = await orderService.getOrderByOrderId(orderId);
    if (!order) throw new NotFoundError('Order not found');

    if (order.deliveryCode !== req.body.deliveryCode) {
      throw new BadRequestError('Invalid delivery code');
    }

    order.status = OrderStatus.DELIVERED;
    orderQueue.addOrderJob('updateOrderInDB', { key: orderId, value: order });

    // TODO: implement logic to move balance from escrow to main balance.

    res.status(HTTP_STATUS.OK).json({ message: 'Order completed' });
  }
}

export const updateOrder: UpdateOrder = new UpdateOrder();
